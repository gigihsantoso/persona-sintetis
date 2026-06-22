# 🎨 Persona Sintetis - UI Design Mockups

## Metadata
- **Status:** Draft
- **Date:** 2026-06-22
- **Version:** MVP v1.0

---

## 1. Design System

### Colors

```
Primary Colors:
├── Primary:       #6366f1 (Indigo 500) - Main actions, links
├── Primary Dark:  #4f46e5 (Indigo 600) - Hover states
├── Primary Light: #a5b4fc (Indigo 300) - Backgrounds

Secondary Colors:
├── Accent:        #ec4899 (Pink 500) - Highlights, CTAs
├── Success:       #10b981 (Emerald 500) - Success states
├── Warning:       #f59e0b (Amber 500) - Warnings
├── Error:         #ef4444 (Red 500) - Errors
├── Info:          #3b82f6 (Blue 500) - Information

Neutrals:
├── Background:    #ffffff (White)
├── Surface:       #f8fafc (Slate 50)
├── Border:        #e2e8f0 (Slate 200)
├── Text Primary:  #1e293b (Slate 800)
├── Text Secondary:#64748b (Slate 500)
├── Text Muted:    #94a3b8 (Slate 400)
```

### Typography

```
Font Family: Inter (Primary), JetBrains Mono (Code)

Scale:
├── Heading 1:     2.5rem / 40px   - Page titles
├── Heading 2:     2rem / 32px     - Section headers
├── Heading 3:     1.5rem / 24px   - Card titles
├── Heading 4:     1.25rem / 20px  - Subsections
├── Body Large:    1.125rem / 18px - Lead text
├── Body:          1rem / 16px     - Default text
├── Body Small:    0.875rem / 14px - Captions
├── Label:         0.75rem / 12px  - Form labels
```

### Spacing

```
Base Unit: 4px

Scale:
├── xs:  4px   (0.25rem)
├── sm:  8px   (0.5rem)
├── md:  16px  (1rem)
├── lg:  24px  (1.5rem)
├── xl:  32px  (2rem)
├── 2xl: 48px  (3rem)
├── 3xl: 64px  (4rem)
```

### Components

```
Buttons:
├── Primary:   bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-4 py-2
├── Secondary: bg-white border border-slate-200 text-slate-700 hover:bg-slate-50
├── Ghost:     text-indigo-500 hover:bg-indigo-50
└── Icon:      p-2 hover:bg-slate-100 rounded-lg

Inputs:
├── Text:      border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500
├── Textarea:  Same as text, min-h-[120px]
└── Select:    Same as text, with chevron icon

Cards:
├── Default:   bg-white rounded-xl border border-slate-200 shadow-sm
└── Hover:     shadow-md transition-shadow

Badges:
├── Success:   bg-emerald-100 text-emerald-700
├── Warning:   bg-amber-100 text-amber-700
├── Error:     bg-red-100 text-red-700
└── Info:      bg-blue-100 text-blue-700
```

---

## 2. Wireframes (ASCII)

### 2.1 Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🎭 Persona Sintetis        [Dashboard] [Characters] [Gallery] [Settings]   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │                         MAIN CONTENT AREA                           │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Dashboard

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🎭 Persona Sintetis        Dashboard  Characters  Gallery     👤 Profile   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Welcome back, Creator!                          [+ New Character]          │
│                                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │
│  │ 📊 Stats    │  │ 🎭 Characters│  │ 🖼️ Images   │  │ ⚡ Quick Actions│   │
│  │             │  │             │  │             │  │                 │   │
│  │   12        │  │    8        │  │    45       │  │  • Generate     │   │
│  │   Images    │  │   Active    │  │   Total     │  │  • Upload Ref   │   │
│  │   this week │  │   Characters│  │   Images    │  │  • Export PDF   │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────┘   │
│                                                                             │
│  Recent Characters                                                          │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │   [IMG]      │ │   [IMG]      │ │   [IMG]      │ │   [IMG]      │       │
│  │   Aria       │ │   Kael       │ │   Luna       │ │   + New      │       │
│  │   Fantasy    │ │   Sci-Fi     │ │   Modern     │ │              │       │
│  │   5 images   │ │   12 images  │ │   3 images   │ │              │       │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘       │
│                                                                             │
│  Recent Generations                                                         │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐        │
│  │ [IMG]  │ │ [IMG]  │ │ [IMG]  │ │ [IMG]  │ │ [IMG]  │ │ [IMG]  │        │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Character Form (Create/Edit)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ← Back                    Create Character                    [Save Draft] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Step 1: Basic Info                          Step 2: Appearance             │
│  ┌─────────────────────────────────┐         ┌───────────────────────────┐ │
│  │                                 │         │                           │ │
│  │  Character Name *               │         │  Physical Appearance      │ │
│  │  ┌───────────────────────────┐  │         │  ┌─────────────────────┐  │ │
│  │  │ Enter character name...   │  │         │  │ Height, build, etc. │  │ │
│  │  └───────────────────────────┘  │         │  └─────────────────────┘  │ │
│  │                                 │         │                           │ │
│  │  Genre/Style                    │         │  Face Features            │ │
│  │  ┌───────────────────────────┐  │         │  ┌─────────────────────┐  │ │
│  │  │ Fantasy ▼                 │  │         │  │ Eyes, hair, skin... │  │ │
│  │  └───────────────────────────┘  │         │  └─────────────────────┘  │ │
│  │                                 │         │                           │ │
│  │  Short Description              │         │  Clothing Style           │ │
│  │  ┌───────────────────────────┐  │         │  ┌─────────────────────┐  │ │
│  │  │ One-line character summary│  │         │  │ Typical outfits...  │  │ │
│  │  └───────────────────────────┘  │         │  └─────────────────────┘  │ │
│  │                                 │         │                           │ │
│  └─────────────────────────────────┘         └───────────────────────────┘ │
│                                                                             │
│  Step 3: Personality                         Step 4: Background             │
│  ┌─────────────────────────────────┐         ┌───────────────────────────┐ │
│  │                                 │         │                           │ │
│  │  Personality Traits             │         │  Backstory                │ │
│  │  ┌───────────────────────────┐  │         │  ┌─────────────────────┐  │ │
│  │  │ Brave, Intelligent, ...   │  │         │  │ Character history.. │  │ │
│  │  └───────────────────────────┘  │         │  └─────────────────────┘  │ │
│  │                                 │         │                           │ │
│  │  Speech Pattern                 │         │  Occupation/Role          │ │
│  │  ┌───────────────────────────┐  │         │  ┌─────────────────────┐  │ │
│  │  │ How they speak...         │  │         │  │ Job, title, etc...  │  │ │
│  │  └───────────────────────────┘  │         │  └─────────────────────┘  │ │
│  │                                 │         │                           │ │
│  └─────────────────────────────────┘         └───────────────────────────┘ │
│                                                                             │
│  Step 5: Reference Images                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Upload Reference Images (1-5)                                      │   │
│  │  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐                 │   │
│  │  │  +    │ │ [IMG] │ │ [IMG] │ │       │ │       │                 │   │
│  │  │ Add   │ │  x    │ │  x    │ │       │ │       │                 │   │
│  │  └───────┘ └───────┘ └───────┘ └───────┘ └───────┘                 │   │
│  │                                                                     │   │
│  │  [🤖 Auto-generate description from images]                         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│                              [← Previous]  [Save & Continue →]              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.4 Character Detail Page

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ← Characters              Aria the Mage                       [Edit] [⋮]  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐  ┌────────────────────────────────────────────────┐   │
│  │                 │  │                                                │   │
│  │                 │  │  Aria                                          │   │
│  │    [MAIN IMG]   │  │  Fantasy • Wizard                              │   │
│  │                 │  │                                                │   │
│  │                 │  │  "A powerful mage from the Northern Kingdoms" │   │
│  │                 │  │                                                │   │
│  │  [●] [○] [○]    │  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │   │
│  │                 │  │                                                │   │
│  └─────────────────┘  │  📋 Character Sheet                            │   │
│                       │  ┌──────────────────────────────────────────┐  │   │
│                       │  │ Appearance: Tall, silver hair, blue eyes │  │   │
│  Generated: 24 images │  │ Personality: Wise, mysterious, kind      │  │   │
│  Consistency: 94%     │  │ Clothing: Blue robes with star patterns  │  │   │
│                       │  │ Background: Royal mage, 200 years old    │  │   │
│  [Generate New]       │  └──────────────────────────────────────────┘  │   │
│  [Export PDF]         │                                                │   │
│  [Duplicate]          │  🏷️ Tags: #mage #fantasy #female #silver-hair│   │
│                       │                                                │   │
│                       └────────────────────────────────────────────────┘   │
│                                                                             │
│  Generated Images                                                           │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐        │
│  │ [IMG]  │ │ [IMG]  │ │ [IMG]  │ │ [IMG]  │ │ [IMG]  │ │ [IMG]  │        │
│  │ 98%    │ │ 95%    │ │ 92%    │ │ 96%    │ │ 94%    │ │ 91%    │        │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘        │
│                                                                             │
│  [Load More...]                                                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.5 Generate Page

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ← Characters    Generate: Aria                    Credits: 45 remaining   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────┐  ┌─────────────────────────────────┐  │
│  │                                 │  │                                 │  │
│  │  Character                      │  │  Generation Settings            │  │
│  │  ┌───────────────────────────┐  │  │                                 │  │
│  │  │ [IMG] Aria                │  │  │  Prompt                         │  │
│  │  │ Fantasy Wizard            │  │  │  ┌───────────────────────────┐  │  │
│  │  │ Consistency: 94%          │  │  │  │ Standing in a magical...  │  │  │
│  │  └───────────────────────────┘  │  │  └───────────────────────────┘  │  │
│  │                                 │  │                                 │  │
│  │  Multi-Character                │  │  Aspect Ratio                   │  │
│  │  ┌───────────────────────────┐  │  │  ┌─────┐ ┌─────┐ ┌─────┐       │  │
│  │  │ [+ Add Character]         │  │  │  │ 1:1 │ │ 3:4 │ │ 9:16│       │  │
│  │  │                           │  │  │  └─────┘ └─────┘ └─────┘       │  │
│  │  │ Up to 5 characters        │  │  │                                 │  │
│  │  └───────────────────────────┘  │  │  Style Preset                   │  │
│  │                                 │  │  ┌───────────────────────────┐  │  │
│  │                                 │  │  │ Realistic ▼               │  │  │
│  │                                 │  │  └───────────────────────────┘  │  │
│  │                                 │  │                                 │  │
│  │                                 │  │  Quality                        │  │
│  │                                 │  │  ○ Standard  ● HD  ○ Ultra     │  │
│  │                                 │  │                                 │  │
│  │                                 │  │  Number of Images               │  │
│  │                                 │  │  [1] [2] [4] [8]                │  │
│  │                                 │  │                                 │  │
│  │                                 │  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━   │  │
│  │                                 │  │  Cost: 4 credits                │  │
│  │                                 │  │                                 │  │
│  │                                 │  │  [🎨 Generate Images]           │  │
│  │                                 │  │                                 │  │
│  └─────────────────────────────────┘  └─────────────────────────────────┘  │
│                                                                             │
│  ──────────────────── or ────────────────────                               │
│                                                                             │
│  Quick Prompts                                                              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │ Portrait     │ │ Full Body    │ │ Action Pose  │ │ Environment  │       │
│  │ Close-up     │ │ Standing     │ │ Dynamic      │ │ Background   │       │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.6 Gallery Page

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🎭 Persona Sintetis    Dashboard  Characters  [Gallery]     👤 Profile     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Gallery                                      [Upload] [Select] [Export]   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🔍 Search images...                          [All Characters ▼]     │   │
│  │                                                                    │   │
│  │  Filter: [All] [This Week] [This Month] [Favorites]                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │          │ │          │ │          │ │          │ │          │        │
│  │  [IMG]   │ │  [IMG]   │ │  [IMG]   │ │  [IMG]   │ │  [IMG]   │        │
│  │          │ │          │ │          │ │          │ │          │        │
│  │  Aria    │ │  Kael    │ │  Aria    │ │  Luna    │ │  Kael    │        │
│  │  98%     │ │  95%     │ │  92%     │ │  97%     │ │  94%     │        │
│  │  ♡ ⋮     │ │  ♡ ⋮     │ │  ♡ ⋮     │ │  ♡ ⋮     │ │  ♡ ⋮     │        │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
│                                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │          │ │          │ │          │ │          │ │          │        │
│  │  [IMG]   │ │  [IMG]   │ │  [IMG]   │ │  [IMG]   │ │  [IMG]   │        │
│  │          │ │          │ │          │ │          │ │          │        │
│  │  Aria    │ │  Luna    │ │  Kael    │ │  Aria    │ │  Luna    │        │
│  │  96%     │ │  93%     │ │  91%     │ │  95%     │ │  98%     │        │
│  │  ♡ ⋮     │ │  ♡ ⋮     │ │  ♡ ⋮     │ │  ♡ ⋮     │ │  ♡ ⋮     │        │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
│                                                                             │
│  Page: [←] 1 2 3 4 5 [→]                                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.7 Image Modal (Lightbox)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                           ┌─────────────────────┐                          │
│                           │                     │                          │
│                           │                     │                          │
│                           │                     │                          │
│                           │     [FULL IMAGE]    │                          │
│                           │                     │                          │
│                           │                     │                          │
│                           │                     │                          │
│                           └─────────────────────┘                          │
│                                                                             │
│  Aria the Mage • Generated 2 hours ago                    [⬇] [♡] [✕]     │
│                                                                             │
│  Consistency Score: 98%                                                     │
│  Prompt: "Aria standing in a magical forest, glowing runes around her..."  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Related Images                                                      │   │
│  │ [●] [○] [○] [○] [○] [○] [○] [○]                                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. HTML/Tailwind Mockups

### 3.1 Character Form Component

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Create Character - Persona Sintetis</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: { 50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc', 400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca', 800: '#3730a3', 900: '#312e81' },
          }
        }
      }
    }
  </script>
</head>
<body class="bg-slate-50 min-h-screen">
  <!-- Navigation -->
  <nav class="bg-white border-b border-slate-200 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <a href="#" class="flex items-center space-x-2">
            <span class="text-2xl">🎭</span>
            <span class="text-xl font-bold text-slate-800">Persona Sintetis</span>
          </a>
          <div class="hidden md:flex ml-10 space-x-8">
            <a href="#" class="text-slate-500 hover:text-slate-700 px-3 py-2 text-sm font-medium">Dashboard</a>
            <a href="#" class="text-slate-500 hover:text-slate-700 px-3 py-2 text-sm font-medium">Characters</a>
            <a href="#" class="text-slate-500 hover:text-slate-700 px-3 py-2 text-sm font-medium">Gallery</a>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <button class="text-slate-500 hover:text-slate-700">
            <span class="sr-only">Notifications</span>
            <span class="relative">
              <span class="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            </span>
          </button>
          <div class="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">C</div>
        </div>
      </div>
    </div>
  </nav>

  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div class="flex items-center space-x-4">
        <a href="#" class="text-slate-500 hover:text-slate-700">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        </a>
        <h1 class="text-2xl font-bold text-slate-800">Create Character</h1>
      </div>
      <div class="flex space-x-3">
        <button class="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
          Save Draft
        </button>
        <button class="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600">
          Save & Continue
        </button>
      </div>
    </div>

    <!-- Progress Steps -->
    <div class="mb-8">
      <div class="flex items-center justify-center">
        <div class="flex items-center">
          <div class="h-8 w-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-medium">1</div>
          <span class="ml-2 text-sm font-medium text-primary-600">Basic Info</span>
        </div>
        <div class="w-16 h-0.5 bg-slate-200 mx-4"></div>
        <div class="flex items-center">
          <div class="h-8 w-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-medium">2</div>
          <span class="ml-2 text-sm font-medium text-slate-500">Appearance</span>
        </div>
        <div class="w-16 h-0.5 bg-slate-200 mx-4"></div>
        <div class="flex items-center">
          <div class="h-8 w-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-medium">3</div>
          <span class="ml-2 text-sm font-medium text-slate-500">Personality</span>
        </div>
        <div class="w-16 h-0.5 bg-slate-200 mx-4"></div>
        <div class="flex items-center">
          <div class="h-8 w-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-medium">4</div>
          <span class="ml-2 text-sm font-medium text-slate-500">References</span>
        </div>
      </div>
    </div>

    <!-- Form Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Basic Info -->
      <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 class="text-lg font-semibold text-slate-800 mb-4">Step 1: Basic Information</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Character Name *</label>
            <input type="text" placeholder="Enter character name..." class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Genre / Style</label>
            <select class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option>Fantasy</option>
              <option>Sci-Fi</option>
              <option>Modern</option>
              <option>Anime</option>
              <option>Realistic</option>
              <option>Historical</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Short Description</label>
            <textarea rows="3" placeholder="One-line character summary..." class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"></textarea>
          </div>
        </div>
      </div>

      <!-- Appearance -->
      <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 class="text-lg font-semibold text-slate-800 mb-4">Step 2: Physical Appearance</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Physical Traits</label>
            <textarea rows="3" placeholder="Height, build, body type, distinctive features..." class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Face Features</label>
            <textarea rows="3" placeholder="Eye color, hair color & style, skin tone, facial features..." class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Clothing Style</label>
            <textarea rows="3" placeholder="Typical outfits, accessories, style preferences..." class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"></textarea>
          </div>
        </div>
      </div>

      <!-- Personality -->
      <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 class="text-lg font-semibold text-slate-800 mb-4">Step 3: Personality</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Personality Traits</label>
            <input type="text" placeholder="e.g., Brave, Intelligent, Mysterious, Kind..." class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Speech Pattern</label>
            <textarea rows="3" placeholder="How do they speak? Formal, casual, archaic, slang..." class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Likes & Dislikes</label>
            <textarea rows="3" placeholder="What do they love? What do they hate?" class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"></textarea>
          </div>
        </div>
      </div>

      <!-- Background -->
      <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 class="text-lg font-semibold text-slate-800 mb-4">Step 4: Background</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Backstory</label>
            <textarea rows="4" placeholder="Character history, origin story, important events..." class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Occupation / Role</label>
            <input type="text" placeholder="e.g., Wizard, Warrior, CEO, Student..." class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Relationships</label>
            <textarea rows="2" placeholder="Family, friends, enemies, allies..." class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"></textarea>
          </div>
        </div>
      </div>
    </div>

    <!-- Reference Images -->
    <div class="mt-8 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h2 class="text-lg font-semibold text-slate-800 mb-4">Step 5: Reference Images</h2>
      
      <div class="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-primary-300 transition-colors">
        <svg class="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <p class="mt-2 text-sm text-slate-600">Drag and drop images here, or click to upload</p>
        <p class="mt-1 text-xs text-slate-500">PNG, JPG up to 10MB (1-5 images)</p>
        <button class="mt-4 px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100">
          Browse Files
        </button>
      </div>

      <div class="mt-4 flex items-center justify-between">
        <button class="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          <span>Auto-generate description from images</span>
        </button>
        <span class="text-sm text-slate-500">0/5 images uploaded</span>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="mt-8 flex justify-between">
      <button class="px-6 py-3 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
        ← Cancel
      </button>
      <div class="flex space-x-3">
        <button class="px-6 py-3 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
          Save Draft
        </button>
        <button class="px-6 py-3 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600">
          Save & Continue →
        </button>
      </div>
    </div>
  </main>
</body>
</html>
```

### 3.2 Generate Page Component

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generate - Persona Sintetis</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: { 50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc', 400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca', 800: '#3730a3', 900: '#312e81' },
          }
        }
      }
    }
  </script>
</head>
<body class="bg-slate-50 min-h-screen">
  <!-- Navigation -->
  <nav class="bg-white border-b border-slate-200 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center space-x-4">
          <a href="#" class="text-slate-500 hover:text-slate-700">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          </a>
          <span class="text-lg font-semibold text-slate-800">Generate: Aria the Mage</span>
        </div>
        <div class="flex items-center space-x-4">
          <div class="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
            ⚡ 45 credits remaining
          </div>
          <div class="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">C</div>
        </div>
      </div>
    </div>
  </nav>

  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Panel: Character Selection -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Selected Character -->
        <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div class="flex items-start space-x-4">
            <img src="https://via.placeholder.com/80" alt="Aria" class="w-20 h-20 rounded-lg object-cover">
            <div class="flex-1">
              <h3 class="font-semibold text-slate-800">Aria the Mage</h3>
              <p class="text-sm text-slate-500">Fantasy • Wizard</p>
              <div class="mt-2 flex items-center space-x-2">
                <span class="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">94% consistency</span>
              </div>
            </div>
            <button class="text-slate-400 hover:text-slate-600">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        </div>

        <!-- Add More Characters -->
        <div class="bg-white rounded-xl border-2 border-dashed border-slate-200 p-4 text-center hover:border-primary-300 transition-colors cursor-pointer">
          <svg class="mx-auto h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          <p class="mt-2 text-sm font-medium text-slate-600">Add Character</p>
          <p class="text-xs text-slate-500">Up to 5 characters per scene</p>
        </div>

        <!-- Character Library -->
        <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <h4 class="text-sm font-semibold text-slate-700 mb-3">Recent Characters</h4>
          <div class="space-y-2">
            <div class="flex items-center space-x-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
              <img src="https://via.placeholder.com/40" alt="Kael" class="w-10 h-10 rounded-lg object-cover">
              <div>
                <p class="text-sm font-medium text-slate-800">Kael</p>
                <p class="text-xs text-slate-500">Sci-Fi • Warrior</p>
              </div>
            </div>
            <div class="flex items-center space-x-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
              <img src="https://via.placeholder.com/40" alt="Luna" class="w-10 h-10 rounded-lg object-cover">
              <div>
                <p class="text-sm font-medium text-slate-800">Luna</p>
                <p class="text-xs text-slate-500">Modern • Artist</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel: Generation Settings -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Prompt Input -->
        <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <label class="block text-sm font-medium text-slate-700 mb-2">Prompt</label>
          <textarea rows="4" placeholder="Describe the scene you want to generate..." class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">Aria standing in a magical forest at twilight, glowing runes floating around her hands, ethereal blue light illuminating her face, ancient trees in background, fantasy art style, highly detailed</textarea>
          
          <div class="mt-4 flex items-center justify-between">
            <button class="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              <span>Enhance with AI</span>
            </button>
            <span class="text-sm text-slate-500">247 characters</span>
          </div>
        </div>

        <!-- Settings Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Aspect Ratio -->
          <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h4 class="text-sm font-semibold text-slate-700 mb-4">Aspect Ratio</h4>
            <div class="grid grid-cols-3 gap-3">
              <button class="aspect-square border-2 border-primary-500 bg-primary-50 rounded-lg flex flex-col items-center justify-center p-3">
                <span class="text-sm font-medium text-primary-700">1:1</span>
                <span class="text-xs text-primary-500">Square</span>
              </button>
              <button class="aspect-[3/4] border border-slate-200 rounded-lg flex flex-col items-center justify-center p-3 hover:border-slate-300">
                <span class="text-sm font-medium text-slate-700">3:4</span>
                <span class="text-xs text-slate-500">Portrait</span>
              </button>
              <button class="aspect-[9/16] border border-slate-200 rounded-lg flex flex-col items-center justify-center p-3 hover:border-slate-300">
                <span class="text-sm font-medium text-slate-700">9:16</span>
                <span class="text-xs text-slate-500">Story</span>
              </button>
            </div>
          </div>

          <!-- Style Preset -->
          <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h4 class="text-sm font-semibold text-slate-700 mb-4">Style Preset</h4>
            <select class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option>Realistic</option>
              <option>Fantasy Art</option>
              <option>Anime</option>
              <option>Digital Painting</option>
              <option>Watercolor</option>
              <option>3D Render</option>
            </select>
            
            <div class="mt-4 grid grid-cols-2 gap-2">
              <div class="p-3 border border-slate-200 rounded-lg text-center hover:bg-slate-50 cursor-pointer">
                <div class="text-2xl mb-1">🎨</div>
                <span class="text-xs text-slate-600">Artistic</span>
              </div>
              <div class="p-3 border-2 border-primary-500 bg-primary-50 rounded-lg text-center cursor-pointer">
                <div class="text-2xl mb-1">📷</div>
                <span class="text-xs text-primary-600">Photographic</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quality & Count -->
        <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="text-sm font-semibold text-slate-700 mb-4">Quality</h4>
              <div class="space-y-2">
                <label class="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                  <input type="radio" name="quality" class="text-primary-500 focus:ring-primary-500">
                  <div>
                    <span class="text-sm font-medium text-slate-700">Standard</span>
                    <p class="text-xs text-slate-500">Fast generation, good quality</p>
                  </div>
                </label>
                <label class="flex items-center space-x-3 p-3 border-2 border-primary-500 bg-primary-50 rounded-lg cursor-pointer">
                  <input type="radio" name="quality" checked class="text-primary-500 focus:ring-primary-500">
                  <div>
                    <span class="text-sm font-medium text-primary-700">HD</span>
                    <p class="text-xs text-primary-500">Higher detail, 2x credits</p>
                  </div>
                </label>
                <label class="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                  <input type="radio" name="quality" class="text-primary-500 focus:ring-primary-500">
                  <div>
                    <span class="text-sm font-medium text-slate-700">Ultra</span>
                    <p class="text-xs text-slate-500">Maximum detail, 4x credits</p>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <h4 class="text-sm font-semibold text-slate-700 mb-4">Number of Images</h4>
              <div class="grid grid-cols-4 gap-3">
                <button class="aspect-square border-2 border-primary-500 bg-primary-50 rounded-lg flex flex-col items-center justify-center">
                  <span class="text-lg font-bold text-primary-700">1</span>
                  <span class="text-xs text-primary-500">1 credit</span>
                </button>
                <button class="aspect-square border border-slate-200 rounded-lg flex flex-col items-center justify-center hover:border-slate-300">
                  <span class="text-lg font-bold text-slate-700">2</span>
                  <span class="text-xs text-slate-500">2 credits</span>
                </button>
                <button class="aspect-square border border-slate-200 rounded-lg flex flex-col items-center justify-center hover:border-slate-300">
                  <span class="text-lg font-bold text-slate-700">4</span>
                  <span class="text-xs text-slate-500">4 credits</span>
                </button>
                <button class="aspect-square border border-slate-200 rounded-lg flex flex-col items-center justify-center hover:border-slate-300">
                  <span class="text-lg font-bold text-slate-700">8</span>
                  <span class="text-xs text-slate-500">8 credits</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Cost Summary -->
          <div class="mt-6 pt-6 border-t border-slate-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-slate-600">Total Cost</p>
                <p class="text-2xl font-bold text-slate-800">4 credits</p>
              </div>
              <button class="px-8 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 flex items-center space-x-2">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                <span>Generate Images</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Quick Prompts -->
        <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h4 class="text-sm font-semibold text-slate-700 mb-4">Quick Prompts</h4>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button class="p-4 border border-slate-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left">
              <div class="text-2xl mb-2">👤</div>
              <p class="text-sm font-medium text-slate-700">Portrait</p>
              <p class="text-xs text-slate-500">Close-up shot</p>
            </button>
            <button class="p-4 border border-slate-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left">
              <div class="text-2xl mb-2">🧍</div>
              <p class="text-sm font-medium text-slate-700">Full Body</p>
              <p class="text-xs text-slate-500">Standing pose</p>
            </button>
            <button class="p-4 border border-slate-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left">
              <div class="text-2xl mb-2">⚔️</div>
              <p class="text-sm font-medium text-slate-700">Action</p>
              <p class="text-xs text-slate-500">Dynamic pose</p>
            </button>
            <button class="p-4 border border-slate-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left">
              <div class="text-2xl mb-2">🌲</div>
              <p class="text-sm font-medium text-slate-700">Environment</p>
              <p class="text-xs text-slate-500">With background</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</body>
</html>
```

### 3.3 Gallery Page Component

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gallery - Persona Sintetis</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: { 50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc', 400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca', 800: '#3730a3', 900: '#312e81' },
          }
        }
      }
    }
  </script>
</head>
<body class="bg-slate-50 min-h-screen">
  <!-- Navigation -->
  <nav class="bg-white border-b border-slate-200 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center space-x-8">
          <a href="#" class="flex items-center space-x-2">
            <span class="text-2xl">🎭</span>
            <span class="text-xl font-bold text-slate-800">Persona Sintetis</span>
          </a>
          <div class="hidden md:flex space-x-8">
            <a href="#" class="text-slate-500 hover:text-slate-700 px-3 py-2 text-sm font-medium">Dashboard</a>
            <a href="#" class="text-slate-500 hover:text-slate-700 px-3 py-2 text-sm font-medium">Characters</a>
            <a href="#" class="text-primary-600 bg-primary-50 px-3 py-2 text-sm font-medium rounded-lg">Gallery</a>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <button class="text-slate-500 hover:text-slate-700">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
          </button>
          <div class="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">C</div>
        </div>
      </div>
    </div>
  </nav>

  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
      <h1 class="text-2xl font-bold text-slate-800 mb-4 md:mb-0">Gallery</h1>
      <div class="flex space-x-3">
        <button class="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center space-x-2">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
          <span>Upload</span>
        </button>
        <button class="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center space-x-2">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
          <span>Export</span>
        </button>
      </div>
    </div>

    <!-- Search & Filters -->
    <div class="bg-white rounded-xl border border-slate-200 p-4 mb-8 shadow-sm">
      <div class="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
        <div class="flex-1 relative">
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input type="text" placeholder="Search images by character, prompt, or tags..." class="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
        </div>
        <div class="flex items-center space-x-4">
          <select class="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
            <option>All Characters</option>
            <option>Aria the Mage</option>
            <option>Kael</option>
            <option>Luna</option>
          </select>
          <div class="flex space-x-2">
            <button class="px-3 py-1.5 text-sm font-medium text-white bg-primary-500 rounded-lg">All</button>
            <button class="px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">This Week</button>
            <button class="px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">Favorites</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Grid -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <!-- Image Card 1 -->
      <div class="group relative bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div class="aspect-square">
          <img src="https://via.placeholder.com/300" alt="Aria" class="w-full h-full object-cover">
        </div>
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div class="absolute bottom-0 left-0 right-0 p-3">
            <p class="text-white text-sm font-medium">Aria the Mage</p>
            <div class="flex items-center justify-between mt-1">
              <span class="text-emerald-400 text-xs">98% consistency</span>
              <div class="flex space-x-2">
                <button class="text-white hover:text-red-400">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                </button>
                <button class="text-white hover:text-slate-300">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Image Card 2 -->
      <div class="group relative bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div class="aspect-square">
          <img src="https://via.placeholder.com/300" alt="Kael" class="w-full h-full object-cover">
        </div>
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div class="absolute bottom-0 left-0 right-0 p-3">
            <p class="text-white text-sm font-medium">Kael</p>
            <div class="flex items-center justify-between mt-1">
              <span class="text-emerald-400 text-xs">95% consistency</span>
              <div class="flex space-x-2">
                <button class="text-white hover:text-red-400">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                </button>
                <button class="text-white hover:text-slate-300">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Repeat for more images (showing 2 of 10 for brevity) -->
      <!-- Add 8 more similar image cards here -->
    </div>

    <!-- Pagination -->
    <div class="mt-8 flex items-center justify-center space-x-2">
      <button class="px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50" disabled>
        ← Previous
      </button>
      <button class="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg">1</button>
      <button class="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">2</button>
      <button class="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">3</button>
      <span class="text-slate-400">...</span>
      <button class="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">12</button>
      <button class="px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
        Next →
      </button>
    </div>
  </main>
</body>
</html>
```

---

## 4. Component Library Reference

### Buttons

```html
<!-- Primary Button -->
<button class="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
  Button Text
</button>

<!-- Secondary Button -->
<button class="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
  Button Text
</button>

<!-- Ghost Button -->
<button class="px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg">
  Button Text
</button>

<!-- Icon Button -->
<button class="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
  <svg class="h-5 w-5" ...></svg>
</button>
```

### Form Inputs

```html
<!-- Text Input -->
<input type="text" class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="Placeholder text">

<!-- Textarea -->
<textarea rows="4" class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="Enter description..."></textarea>

<!-- Select -->
<select class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
  <option>Option 1</option>
  <option>Option 2</option>
</select>

<!-- Checkbox -->
<label class="flex items-center space-x-3">
  <input type="checkbox" class="text-primary-500 focus:ring-primary-500 rounded">
  <span class="text-sm text-slate-700">Label text</span>
</label>

<!-- Radio -->
<label class="flex items-center space-x-3">
  <input type="radio" name="group" class="text-primary-500 focus:ring-primary-500">
  <span class="text-sm text-slate-700">Option</span>
</label>
```

### Cards

```html
<!-- Basic Card -->
<div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
  <!-- Content -->
</div>

<!-- Hover Card -->
<div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
  <!-- Content -->
</div>

<!-- Image Card -->
<div class="group relative bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
  <div class="aspect-square">
    <img src="..." class="w-full h-full object-cover">
  </div>
  <!-- Overlay on hover -->
</div>
```

### Badges

```html
<!-- Success Badge -->
<span class="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">Success</span>

<!-- Warning Badge -->
<span class="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">Warning</span>

<!-- Info Badge -->
<span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Info</span>

<!-- Primary Badge -->
<span class="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">Primary</span>
```

---

## 5. Responsive Breakpoints

```
Mobile:     < 640px   (sm)
Tablet:     640px - 1024px   (md)
Desktop:    1024px - 1280px  (lg)
Large:      1280px - 1536px  (xl)
X-Large:    > 1536px  (2xl)
```

---

## 6. Accessibility Guidelines

- All interactive elements must have visible focus states
- Color contrast ratio ≥ 4.5:1 for text
- All images must have alt text
- Form inputs must have associated labels
- Use semantic HTML elements
- Support keyboard navigation
- ARIA labels for icon-only buttons

---

**Last Updated:** 2026-06-22
**Version:** MVP v1.0
