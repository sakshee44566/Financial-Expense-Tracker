# Expense Tracker Graph Component

This component provides interactive and responsive visualizations for expense tracking data.

## Features

- **Interactive Charts**: Bar, pie, and line charts for visualizing expense data
- **Responsive Design**: Adapts to different screen sizes
- **Tab Navigation**: Easy switching between different chart views
- **Animations**: Smooth transitions and animations for better user experience
- **Custom Styling**: Modern and aesthetic design that matches the app theme

## Chart Types

1. **Monthly Income vs Expenses (Bar Chart)**
   - Compares income and expenses across different months
   - Helps identify spending patterns and trends

2. **Category Breakdown (Pie Charts)**
   - Shows distribution of expenses by category
   - Shows distribution of income by category
   - Helps identify major expense categories

3. **Expense & Income Trend (Line Chart)**
   - Visualizes daily expense and income trends
   - Helps track financial progress over time

## Usage

```jsx
import ExpenseGraphs from './components/graph';

// In your component
<ExpenseGraphs transactions={transactions} />
```

## Dependencies

- Chart.js
- react-chartjs-2
- framer-motion
- react-bootstrap

## Styling

The component uses a custom CSS file (`graph.css`) for styling. The design follows modern UI principles with:

- Subtle shadows and rounded corners
- Smooth hover effects
- Responsive layout
- Custom animations
- Consistent color scheme 