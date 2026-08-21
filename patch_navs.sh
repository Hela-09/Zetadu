#!/bin/bash
sed -i 's/import { Home, BookOpen, PenTool, MessageSquare } from '\''lucide-react'\'';/import { Home, BookOpen, MessageSquare, User } from '\''lucide-react'\'';/' src/components/BottomNav.tsx
sed -i 's/import { Home, BookOpen, PenTool, MessageSquare } from '\''lucide-react'\'';/import { Home, BookOpen, MessageSquare, User } from '\''lucide-react'\'';/' src/components/Sidebar.tsx

sed -i 's/{ id: '\''practice'\'', label: '\''Practice'\'', icon: PenTool },/{ id: '\''profile'\'', label: '\''Profile'\'', icon: User },/' src/components/BottomNav.tsx
sed -i 's/{ id: '\''practice'\'', label: '\''Practice'\'', icon: PenTool },/{ id: '\''profile'\'', label: '\''Profile'\'', icon: User },/' src/components/Sidebar.tsx
