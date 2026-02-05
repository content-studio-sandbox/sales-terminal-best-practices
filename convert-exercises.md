# Exercise Conversion Guide

Due to the large number of exercises and their complex nested structures, here's a summary of what needs to be done:

## Completed ✅
- Lab 1: Exercise 1, 2, 3, 4 (all converted to ExerciseCard)
- ExerciseCard component created with special border support

## Remaining Lab 2 Exercises to Convert:

### Exercise -1: Zsh Installation (Special - Green Border)
```tsx
<ExerciseCard
  id="lab2-ex-1"
  title="Exercise -1: Install Zsh (Optional but Recommended) ⭐"
  scenario="Scenario: Set up a modern, powerful shell with Oh My Zsh for better terminal experience"
  isExpanded={expandedExercises.has('lab2-ex-1')}
  onToggle={toggleExercise}
  special={true}
>
  {/* Complex nested content with steps, code blocks, and tips */}
</ExerciseCard>
```

### Exercise 0-6: Standard Exercises
Each follows the same pattern:
```tsx
<ExerciseCard
  id="lab2-ex0"
  title="Exercise 0: Verify Git Installation"
  scenario="Scenario: First time using Git - check if it's installed"
  isExpanded={expandedExercises.has('lab2-ex0')}
  onToggle={toggleExercise}
>
  {/* Exercise content */}
</ExerciseCard>
```

## Pattern for Conversion:
1. Replace opening `<div style={{...}}>` with `<ExerciseCard` props
2. Move title and scenario to props
3. Keep all nested content as children
4. Replace closing `</div>` with `</ExerciseCard>`
5. Add `special={true}` for Exercise -1

## Benefits:
- Consistent UI/UX across all exercises
- Click to expand/collapse
- Hover effects
- Clean, maintainable code
- ~70% code reduction per exercise