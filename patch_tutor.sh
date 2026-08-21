#!/bin/bash
# Adding some icons to the input area of Tutor.tsx

sed -i 's/import { Send, User, Sparkles, Loader2, Trash2 } from '\''lucide-react'\'';/import { Send, User, Sparkles, Loader2, Trash2, Paperclip, Bookmark, FileText, ChevronDown } from '\''lucide-react'\'';/' src/components/Tutor.tsx

