# Interactive Question Cards UI

A modern, interactive UI component for displaying question cards with rich content, animations, and a sophisticated popup system.

## Features

### Question Cards
- Beautiful gradient backgrounds
- Interactive hover effects
- Smooth animations
- Responsive design
- Dynamic content display

### Popup System
- Detailed question information display
- Rich content formatting
- Image gallery with preview
- Smooth transitions and animations
- Theme-aware styling

### UI Components
- Custom scrollbars
- Gradient overlays
- Animated sections
- Responsive layouts
- Touch-friendly interactions

## Tech Stack

- **Framework**: Next.js
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide Icons
- **Images**: Next.js Image Component

## Getting Started

### Prerequisites

- Node.js 14.x or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [https://github.com/sam-verse/yuva-manifesto-2025]
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Question Card Component

```tsx
<QuestionCard
  title="Your Question Title"
  content="Question content"
  stats="Stats information"
  gradient="from-blue-500 to-purple-500"
  emoji="🎯"
  details="Detailed information"
  images={['image1.jpg', 'image2.jpg']}
  icon={YourIcon}
/>
```

### Popup Component

```tsx
<QuestionDetailsPopup
  isOpen={boolean}
  onClose={() => {}}
  title="Popup Title"
  content="Popup content"
  stats="Stats information"
  gradient="from-blue-500 to-purple-500"
  emoji="🎯"
  details="Detailed information"
  images={['image1.jpg', 'image2.jpg']}
  icon={YourIcon}
/>
```

## Customization

### Colors and Themes

The components use Tailwind CSS for styling. You can customize the colors by modifying the gradient classes:

```tsx
// Example gradients
"from-blue-500 to-purple-500"
"from-green-400 to-teal-500"
"from-red-500 to-pink-500"
```

### Animations

Animations are powered by Framer Motion. You can customize the animation properties in the component files:

```tsx
// Example animation properties
initial={{ opacity: 0, scale: 0.95 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ type: 'spring', damping: 25, stiffness: 300 }}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/) 