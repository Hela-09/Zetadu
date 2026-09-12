import fs from 'fs';
import path from 'path';

export interface DisabledUserInfo {
  uid: string;
  email?: string;
  reason?: string;
  disabledAt: number;
  disabledBy?: string;
}

const STORAGE_FILE_LOCAL = path.resolve(process.cwd(), 'disabled_users_store.json');
const STORAGE_FILE_TMP = '/tmp/zetadu_disabled_users_store.json';

const disabledByUid = new Map<string, DisabledUserInfo>();
const disabledByEmail = new Map<string, DisabledUserInfo>();

function normalizeEmail(email?: string): string {
  if (!email) return '';
  return email.trim().toLowerCase();
}

function loadStore() {
  const candidates = [STORAGE_FILE_LOCAL, STORAGE_FILE_TMP];
  for (const filePath of candidates) {
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const list: DisabledUserInfo[] = JSON.parse(content);
        if (Array.isArray(list)) {
          list.forEach(item => {
            if (item.uid) disabledByUid.set(item.uid, item);
            if (item.email) disabledByEmail.set(normalizeEmail(item.email), item);
          });
          return;
        }
      }
    } catch (_) {}
  }
}

// Initial load
loadStore();

function persistStore() {
  const list = Array.from(disabledByUid.values());
  const data = JSON.stringify(list, null, 2);
  try {
    fs.writeFileSync(STORAGE_FILE_LOCAL, data, 'utf-8');
  } catch (_) {
    try {
      fs.writeFileSync(STORAGE_FILE_TMP, data, 'utf-8');
    } catch (_) {}
  }
}

export function disableUser(uid: string, email?: string, reason?: string, disabledBy?: string): DisabledUserInfo {
  const info: DisabledUserInfo = {
    uid,
    email: email ? normalizeEmail(email) : undefined,
    reason: reason || 'Disabled by Super Admin',
    disabledAt: Date.now(),
    disabledBy: disabledBy || 'Super Admin'
  };

  disabledByUid.set(uid, info);
  if (info.email) {
    disabledByEmail.set(info.email, info);
  }
  persistStore();
  return info;
}

export function enableUser(uid: string, email?: string) {
  const existing = disabledByUid.get(uid);
  disabledByUid.delete(uid);
  if (email) {
    disabledByEmail.delete(normalizeEmail(email));
  }
  if (existing && existing.email) {
    disabledByEmail.delete(normalizeEmail(existing.email));
  }
  persistStore();
}

export function isUserDisabled(uid?: string, email?: string): { disabled: boolean; reason?: string } {
  if (uid && disabledByUid.has(uid)) {
    const item = disabledByUid.get(uid)!;
    return { disabled: true, reason: item.reason || 'This account has been disabled by an administrator.' };
  }
  if (email) {
    const norm = normalizeEmail(email);
    if (norm && disabledByEmail.has(norm)) {
      const item = disabledByEmail.get(norm)!;
      return { disabled: true, reason: item.reason || 'This email address has been disabled by an administrator.' };
    }
  }
  return { disabled: false };
}

export function getAllDisabledUsers(): DisabledUserInfo[] {
  return Array.from(disabledByUid.values());
}
