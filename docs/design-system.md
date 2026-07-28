# FishMaster 디자인 시스템

> FMComponents 기반 디자인 시스템 문서  
> 분석 날짜: 2026-07-28

## 목차

1. [색상 시스템](#색상-시스템)
2. [타이포그래피](#타이포그래피)
3. [간격 시스템](#간격-시스템)
4. [테두리 & 라운드](#테두리--라운드)
5. [컴포넌트 스타일](#컴포넌트-스타일)
6. [상태 스타일](#상태-스타일)
7. [레이아웃 패턴](#레이아웃-패턴)

---

## 색상 시스템

### Primary Colors

#### Gray Scale
```css
--gray-50:  #F9FAFB
--gray-100: #F3F4F6
--gray-200: #E5E7EB
--gray-300: #D1D5DB
--gray-400: #9CA3AF
--gray-500: #6B7280
--gray-600: #4B5563
--gray-700: #374151
--gray-800: #1F2937
--gray-900: #111827
```

#### Blue (Primary Interactive)
```css
--blue-50:  #EFF6FF
--blue-100: #DBEAFE
--blue-500: #3B82F6
--blue-600: #2563EB
--blue-700: #1D4ED8
```

#### Indigo (Accent)
```css
--indigo-500: #6366F1
--indigo-600: #4F46E5
```

#### Red (Error/Warning)
```css
--red-500: #EF4444
--red-600: #DC2626
```

### Semantic Colors

| 용도 | 색상 | Tailwind Class |
|------|------|----------------|
| 배경 (기본) | White | `bg-white` |
| 배경 (보조) | Gray-50/100 | `bg-gray-50` / `bg-gray-100` |
| 배경 (헤더) | Gray-300 | `bg-gray-300` |
| 텍스트 (기본) | Gray-900 | `text-gray-900` |
| 텍스트 (보조) | Gray-600 | `text-gray-600` |
| 텍스트 (비활성) | Gray-400 | `text-gray-400` |
| Border (기본) | Gray-200 | `border-gray-200` |
| Border (Input) | Gray-300 | `border-gray-300` |
| Focus | Blue-500 | `focus:border-blue-500` |
| Error/Required | Red-500 | `text-red-500` |
| Help Text | Blue-500 | `text-blue-500` |
| Active | Blue-50/700 | `bg-blue-50 text-blue-700` |

---

## 타이포그래피

### Font Sizes

| 크기 | Tailwind Class | 실제 크기 | 용도 |
|------|---------------|----------|------|
| Extra Small | `text-xs` | 12px | Help text, Caption |
| Small | `text-sm` | 14px | Input, Label, Body |
| Base | `text-base` | 16px | Default |
| Large | `text-lg` | 18px | Section Title |
| Extra Large | `text-xl` | 20px | Section Header |
| 2XL | `text-2xl` | 24px | - |
| 3XL | `text-3xl` | 30px | Page Title (Desktop) |
| 4XL | `text-4xl` | 36px | Page Title (Desktop) |

### Font Weights

| 굵기 | Tailwind Class | 값 | 용도 |
|------|---------------|-----|------|
| Medium | `font-medium` | 500 | Label, Nav Item |
| Semibold | `font-semibold` | 600 | Card Title |
| Bold | `font-bold` | 700 | Page Title, Header |

### Line Heights

```css
.leading-relaxed  /* 1.625 - 본문 텍스트 */
```

---

## 간격 시스템

### Spacing Scale (Tailwind 기본 단위: 0.25rem = 4px)

| 값 | Class | 실제 크기 |
|----|-------|----------|
| 0.5 | `gap-0.5`, `p-0.5` | 2px |
| 1 | `gap-1`, `p-1` | 4px |
| 2 | `gap-2`, `p-2` | 8px |
| 3 | `gap-3`, `p-3` | 12px |
| 4 | `gap-4`, `p-4` | 16px |
| 5 | `gap-5`, `p-5` | 20px |
| 6 | `gap-6`, `p-6` | 24px |
| 8 | `gap-8`, `p-8` | 32px |
| 10 | `gap-10`, `p-10` | 40px |

### 컴포넌트별 Padding

| 컴포넌트 | Padding |
|---------|---------|
| Input | `px-3 py-2` (12px / 8px) |
| Button (Primary) | `px-4 py-2` (16px / 8px) |
| Button (Secondary) | `px-3 py-1.5` |
| Card | `p-5` (20px) |
| Page Container | `p-6 md:p-10` |
| Section | `p-8 md:p-10` |

---

## 테두리 & 라운드

### Border Radius

| 크기 | Class | 값 | 용도 |
|------|-------|-----|------|
| Small | `rounded` | 4px | - |
| Medium | `rounded-lg` | 8px | Input, Button, Card |
| Large | `rounded-xl` | 12px | Section Card |
| Extra Large | `rounded-2xl` | 16px | Hero Section |
| Full | `rounded-full` | 9999px | Avatar, Badge, Icon Button |

### Border Width

```css
.border       /* 1px - 기본 */
.border-2     /* 2px - 강조 */
```

### Border Colors

| 상태 | Color Class |
|------|------------|
| 기본 | `border-gray-200` |
| Input 기본 | `border-gray-300` |
| Focus | `border-blue-500` |
| Hover | `hover:border-gray-500` |

---

## 컴포넌트 스타일

### FMInput

#### 기본 구조
```html
<label class="flex w-full flex-col gap-1">
  <span class="block text-sm text-gray-600 text-left font-medium">
    라벨
    <span class="ml-0.5 text-red-500">*</span> <!-- required -->
  </span>
  <div class="relative w-full">
    <input 
      type="text" 
      class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm 
             outline-none focus:border-blue-500 
             disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
      placeholder="검색"
    />
    <!-- isClearable: X 버튼 -->
    <button class="absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-0.5 
                   text-gray-400 transition-colors 
                   hover:bg-gray-100 hover:text-gray-600">
      X
    </button>
  </div>
  <!-- Help Text -->
  <span class="text-xs text-blue-500">도움말</span>
  <!-- Warn Text -->
  <span class="text-xs text-red-500">경고 메시지</span>
</label>
```

#### 가로 배치 (isSeparated)
```html
<label class="flex w-full items-start gap-2">
  <span class="shrink-0 pt-2" style="width: 20%;">
    <span class="block text-sm text-gray-600 text-left font-medium">라벨</span>
  </span>
  <span style="width: 80%;">
    <!-- input -->
  </span>
</label>
```

#### 상태별 스타일

| 상태 | 클래스 |
|------|--------|
| 기본 | `border-gray-300` |
| Focus | `focus:border-blue-500` |
| Disabled | `disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400` |
| Error | (border는 직접 제어) |

---

### FMTextarea

```html
<textarea 
  rows="4"
  class="resize-y w-full rounded-lg border border-gray-300 px-3 py-2 text-sm 
         outline-none focus:border-blue-500 
         disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
  placeholder="텍스트를 입력해주세요"
></textarea>
```

- Input과 동일한 스타일 적용
- `resize-y` 허용 (세로만)
- 기본 rows: 4

---

### FMButton

#### Primary Button
```html
<button class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white 
               transition-colors hover:bg-blue-700 
               disabled:cursor-not-allowed disabled:opacity-50">
  버튼
</button>
```

#### Secondary Button
```html
<button class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm 
               font-medium text-gray-700 
               transition-colors hover:bg-gray-100">
  버튼
</button>
```

#### Ghost/Link Button
```html
<button class="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 
               transition-colors hover:bg-gray-100">
  버튼
</button>
```

#### Icon Button
```html
<button class="rounded-lg p-2 text-gray-600 
               transition-colors hover:bg-gray-100">
  <svg class="h-5 w-5">...</svg>
</button>
```

---

### FMSelect

```html
<div class="relative w-full">
  <!-- React-Select 기반 -->
  <div class="rounded-lg border border-gray-300 px-3 py-2 text-sm 
              focus:border-blue-500">
    <!-- Options -->
  </div>
</div>
```

- Input과 동일한 border/padding 스타일
- Dropdown은 별도 Portal로 렌더링

---

### FMTag

```html
<span class="inline-flex items-center gap-1 rounded-full 
             bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
  태그
  <button class="rounded-full hover:bg-blue-200">×</button>
</span>
```

#### 색상 변형

| 색상 | Background | Text |
|------|------------|------|
| Blue | `bg-blue-100` | `text-blue-700` |
| Gray | `bg-gray-100` | `text-gray-700` |
| Red | `bg-red-100` | `text-red-700` |
| Green | `bg-green-100` | `text-green-700` |

---

### FMSwitch

```html
<button 
  role="switch"
  class="relative inline-flex h-6 w-11 items-center rounded-full 
         transition-colors
         bg-gray-200  /* OFF */
         bg-blue-600  /* ON */">
  <span class="inline-block h-4 w-4 transform rounded-full bg-white 
               transition-transform
               translate-x-1  /* OFF */
               translate-x-6  /* ON */"></span>
</button>
```

---

### FMInfoBox

```html
<div class="rounded-lg border border-blue-200 bg-blue-50 p-4">
  <div class="flex gap-3">
    <svg class="h-5 w-5 shrink-0 text-blue-600">...</svg>
    <div class="text-sm text-blue-900">
      메시지
    </div>
  </div>
</div>
```

#### 색상 변형

| 타입 | Border | Background | Text | Icon |
|------|--------|------------|------|------|
| Info | `border-blue-200` | `bg-blue-50` | `text-blue-900` | `text-blue-600` |
| Warning | `border-yellow-200` | `bg-yellow-50` | `text-yellow-900` | `text-yellow-600` |
| Error | `border-red-200` | `bg-red-50` | `text-red-900` | `text-red-600` |
| Success | `border-green-200` | `bg-green-50` | `text-green-900` | `text-green-600` |

---

## 상태 스타일

### Hover

```css
hover:bg-gray-100       /* 배경 */
hover:bg-blue-700       /* 버튼 */
hover:text-gray-600     /* 텍스트 */
hover:border-gray-500   /* 테두리 */
```

### Focus

```css
focus:border-blue-500   /* Input/Select */
focus:outline-none      /* 기본 outline 제거 */
focus:ring-2            /* 선택적 ring */
focus:ring-blue-500
```

### Disabled

```css
disabled:cursor-not-allowed
disabled:bg-gray-100
disabled:text-gray-400
disabled:opacity-50     /* 버튼 */
```

### Active (Navigation)

```css
bg-blue-50 text-blue-700  /* Active nav item */
```

---

## 레이아웃 패턴

### Flexbox 패턴

#### 수직 스택
```html
<div class="flex flex-col gap-4">
  ...
</div>
```

#### 가로 정렬
```html
<div class="flex items-center gap-2">
  ...
</div>
```

#### 양 끝 정렬
```html
<div class="flex items-center justify-between">
  ...
</div>
```

### Grid 패턴

#### 2열 그리드 (반응형)
```html
<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
  ...
</div>
```

### Container 패턴

```html
<!-- Page Container -->
<div class="mx-auto max-w-5xl p-6 md:p-10">
  ...
</div>

<!-- Card Container -->
<div class="rounded-xl border border-gray-200 bg-white p-5">
  ...
</div>
```

---

## 반응형 Breakpoints

| Breakpoint | Class Prefix | Min Width |
|------------|-------------|-----------|
| Mobile | (기본) | 0px |
| Tablet | `md:` | 768px |
| Desktop | `lg:` | 1024px |
| Wide | `xl:` | 1280px |

### 주요 반응형 패턴

```html
<!-- 모바일: 숨김, 태블릿+: 표시 -->
<div class="hidden md:block">...</div>

<!-- 모바일: 표시, 태블릿+: 숨김 -->
<div class="md:hidden">...</div>

<!-- 모바일: 세로, 태블릿+: 가로 -->
<div class="flex-col md:flex-row">...</div>

<!-- Padding 조절 -->
<div class="p-6 md:p-10">...</div>

<!-- Text 크기 조절 -->
<h1 class="text-3xl md:text-4xl">...</h1>
```

---

## 애니메이션 & 트랜지션

### 기본 트랜지션
```css
.transition-colors  /* 색상 변화 */
.transition-transform  /* 변형 */
.transition-all  /* 모든 속성 */
```

### Transform
```css
.rotate-180        /* 화살표 회전 */
.-translate-y-1/2  /* 중앙 정렬 */
.translate-x-6     /* 슬라이드 */
```

---

## 아이콘 시스템

- **라이브러리**: Lucide React
- **기본 크기**: `h-4 w-4` (16px) 또는 `h-5 w-5` (20px)
- **색상**: 부모 텍스트 색상 상속

```html
<svg class="lucide lucide-menu h-5 w-5">
  <line x1="4" x2="20" y1="12" y2="12"></line>
  <line x1="4" x2="20" y1="6" y2="6"></line>
  <line x1="4" x2="20" y1="18" y2="18"></line>
</svg>
```

---

## 그림자 (Shadow)

```css
.shadow          /* 0 1px 3px rgba(0, 0, 0, 0.1) */
.shadow-sm       /* 0 1px 2px rgba(0, 0, 0, 0.05) */
.shadow-md       /* 0 4px 6px rgba(0, 0, 0, 0.1) */
.shadow-lg       /* 0 10px 15px rgba(0, 0, 0, 0.1) */
```

일반적으로 카드나 드롭다운에는 그림자를 사용하지 않고 border로 구분합니다.

---

## 사용 예시

### Form 레이아웃

```html
<form class="flex flex-col gap-6">
  <!-- Input Field -->
  <div class="flex flex-col gap-1">
    <label class="text-sm font-medium text-gray-600">
      이름<span class="text-red-500">*</span>
    </label>
    <input 
      class="rounded-lg border border-gray-300 px-3 py-2 text-sm
             focus:border-blue-500 outline-none"
      placeholder="이름을 입력하세요"
    />
  </div>

  <!-- Button Group -->
  <div class="flex gap-2">
    <button class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white
                   hover:bg-blue-700">
      저장
    </button>
    <button class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium
                   text-gray-700 hover:bg-gray-100">
      취소
    </button>
  </div>
</form>
```

### Navigation

```html
<nav class="flex flex-col gap-1">
  <a class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium
            transition-colors text-gray-700 hover:bg-gray-100"
     href="/path">
    <svg class="h-4 w-4">...</svg>
    <span>메뉴</span>
  </a>
  
  <!-- Active -->
  <a class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium
            bg-blue-50 text-blue-700"
     href="/active">
    <svg class="h-4 w-4">...</svg>
    <span>활성 메뉴</span>
  </a>
</nav>
```

---

## 접근성 고려사항

1. **Focus Visible**: 모든 인터랙티브 요소에 `focus:border-blue-500` 적용
2. **Disabled State**: `disabled:cursor-not-allowed` + 시각적 피드백
3. **Required Fields**: 빨간 별표 `*` 표시
4. **ARIA Labels**: `aria-label`, `aria-current` 사용
5. **Color Contrast**: WCAG AA 기준 충족

---

## Tailwind Config 권장 사항

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        gray: colors.gray,
        blue: colors.blue,
        indigo: colors.indigo,
        red: colors.red,
      },
      maxWidth: {
        '5xl': '64rem',  // 1024px - 콘텐츠 최대 너비
      },
    },
  },
}
```

---

## 마이그레이션 가이드

현재 목업 웹 어드민의 컴포넌트를 FMComponents 스타일로 변경하려면:

1. **색상 교체**: 기존 색상을 위 팔레트로 교체
2. **간격 조정**: Tailwind spacing scale 적용 (`gap-4`, `p-5` 등)
3. **Border Radius**: 모든 컴포넌트 `rounded-lg` 적용
4. **Focus State**: Input/Button에 `focus:border-blue-500` 추가
5. **Transition**: 인터랙티브 요소에 `transition-colors` 추가
6. **Typography**: 텍스트 크기 및 굵기 통일

### 체크리스트

- [ ] Input 컴포넌트: `px-3 py-2`, `border-gray-300`, `focus:border-blue-500`
- [ ] Button 컴포넌트: Primary (`bg-blue-600 hover:bg-blue-700`), Secondary (`border hover:bg-gray-100`)
- [ ] Label: `text-sm font-medium text-gray-600`
- [ ] Help/Error Text: `text-xs text-blue-500` / `text-red-500`
- [ ] Card: `rounded-xl border border-gray-200 bg-white p-5`
- [ ] Nav Item: `px-3 py-2 text-sm font-medium`, Active: `bg-blue-50 text-blue-700`

---

## 추가 리소스

- **Tailwind CSS 공식 문서**: https://tailwindcss.com
- **Lucide Icons**: https://lucide.dev
- **Color Palette Generator**: https://uicolors.app

---

**문서 버전**: 1.0  
**마지막 업데이트**: 2026-07-28  
**담당자**: Claude Code  
**프로젝트**: FishMaster / Tidepool
