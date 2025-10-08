# React Native Reusables Implementation

This project now includes a complete React Native Reusables implementation with NativeWind v4.

## Components Available

All components can be imported from `~/components/ui`:

```typescript
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Text,
  Input,
  Separator,
  Badge,
} from '~/components/ui';
```

### Button

Pressable button component with multiple variants and sizes.

**Variants:** default, secondary, destructive, outline, ghost, link  
**Sizes:** default, sm, lg, icon

```tsx
<Button label="Click Me" variant="secondary" size="lg" onPress={() => {}} />
```

### Card

Container component with subcomponents for structured layouts.

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content goes here</CardContent>
  <CardFooter>Footer content</CardFooter>
</Card>
```

### Text

Text component with style variants.

**Variants:** default, muted, primary, destructive  
**Sizes:** default, sm, lg, xl, 2xl

```tsx
<Text variant="muted" size="sm">Helper text</Text>
```

### Input

Text input field with consistent theming.

```tsx
<Input placeholder="Enter text" />
```

### Separator

Visual separator line.

```tsx
<Separator orientation="horizontal" />
<Separator orientation="vertical" />
```

### Badge

Small badge component for labels and tags.

**Variants:** default, secondary, destructive, outline

```tsx
<Badge label="New" variant="destructive" />
```

## Utilities

### cn() Function

Located in `~/utils/cn.ts`, this utility merges Tailwind classes efficiently:

```typescript
import { cn } from '~/utils/cn';

cn('base-class', condition && 'conditional-class', className);
```

## Theme Configuration

The Tailwind configuration (`tailwind.config.js`) includes a comprehensive theme with colors for:

- Primary, Secondary, Destructive
- Muted, Accent
- Background, Foreground
- Card, Popover
- Border, Input, Ring

All colors follow the HSL color space for easy theming.

## Backward Compatibility

The existing `components/Button.tsx` has been updated to use the new UI Button internally, maintaining the same API:

```tsx
import { Button } from '~/components/Button';

<Button title="Click Me" onPress={() => {}} />
```

## Demo

See `app/(tabs)/index.tsx` for a comprehensive demo showcasing all components.
