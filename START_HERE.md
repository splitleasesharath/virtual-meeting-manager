# 🚀 Virtual Meeting Manager - START HERE

Welcome to the Virtual Meeting Manager React component! This guide will help you get started quickly.

---

## 📦 What Is This?

A complete React + TypeScript component for managing virtual meetings, converted from Bubble.io. It handles:

✅ Responding to meeting requests
✅ Booking new virtual meetings
✅ Canceling existing meetings
✅ Viewing meeting details with Google Calendar integration

---

## 🎯 Quick Links

### For First-Time Users
👉 **[README.md](./README.md)** - Complete documentation (start here!)

### For Implementation
👉 **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Step-by-step setup guide

### For Examples
👉 **[USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md)** - 12 practical examples

### For Understanding the Project
👉 **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - High-level overview
👉 **[FILE_INDEX.md](./FILE_INDEX.md)** - Complete file listing

---

## ⚡ 5-Minute Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your Bubble.io API URL
```

### 3. Build the Component
```bash
npm run build
```

### 4. Use in Your App
```tsx
import { VirtualMeetingManager } from 'virtual-meeting-manager';

function App() {
  return (
    <VirtualMeetingManager
      proposal={proposalData}
      initialView="respond"
      currentUser={userData}
      onClose={() => console.log('Closed')}
    />
  );
}
```

---

## 📚 Documentation Structure

```
START_HERE.md (you are here)
├── README.md              → Main documentation
├── IMPLEMENTATION_GUIDE.md → How to implement
├── USAGE_EXAMPLES.md      → Code examples
├── PROJECT_SUMMARY.md     → What was built
└── FILE_INDEX.md          → File reference
```

---

## 🎨 What's Included

### 6 React Components
- VirtualMeetingManager (main container)
- RespondToVMRequest
- BookVirtualMeeting
- CancelVirtualMeetings
- DetailsOfProposalAndVM
- BookTimeSlot (calendar)

### Full TypeScript Support
- Complete type definitions
- Interface documentation
- Type-safe API calls

### Comprehensive Styling
- 4 CSS modules
- Responsive design
- Customizable colors

### API Integration
- 7+ Bubble.io workflows
- Error handling
- Retry logic

### Documentation
- 100+ pages of docs
- 12 usage examples
- Implementation guide

---

## 🛠️ Common Tasks

### Run Development Mode
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Lint Code
```bash
npm run lint
```

### Format Code
```bash
npm run format
```

---

## 📋 Prerequisites

- Node.js 16+
- React 18+
- TypeScript 5+
- Bubble.io backend with required workflows

---

## 🎓 Learning Path

### Beginner
1. Read [README.md](./README.md) introduction
2. Review [USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md) Example 1
3. Follow [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) Quick Start

### Intermediate
1. Study component architecture in [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)
2. Review API integration patterns
3. Explore customization options

### Advanced
1. Deep dive into [FILE_INDEX.md](./FILE_INDEX.md)
2. Examine TypeScript types
3. Customize components and styling

---

## 🔧 Configuration

### Environment Variables (.env)
```env
REACT_APP_BUBBLE_API_BASE=https://your-app.bubbleapps.io/api/1.1/wf
```

### Component Props
```tsx
interface VirtualMeetingManagerProps {
  proposal: Proposal;
  initialView?: ViewState;
  currentUser: User;
  onClose: () => void;
}
```

---

## 🐛 Troubleshooting

### API Calls Not Working
- Check `.env` configuration
- Verify Bubble.io workflows are published
- Check browser console for errors

### Styles Not Applying
- Ensure CSS modules support in build system
- Verify imports are correct

### TypeScript Errors
- Install `@types/react` and `@types/react-dom`
- Check TypeScript version (>= 5.0 required)

See [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) Troubleshooting section for more.

---

## 📱 Component Views

### 1. Respond View
User can select from proposed times or decline

### 2. Request View
User can select 3 time slots from calendar

### 3. Cancel View
Confirmation dialog for canceling meetings

### 4. Details View
Display booked meeting with calendar integration

---

## 🌟 Key Features

- ✅ Full TypeScript support
- ✅ Responsive design (mobile + desktop)
- ✅ EST timezone handling
- ✅ Google Calendar integration
- ✅ Accessible (ARIA labels, keyboard nav)
- ✅ Error handling
- ✅ Loading states
- ✅ Customizable styling

---

## 📦 File Structure

```
virtual-meeting-manager/
├── src/
│   ├── components/      # 6 React components
│   ├── types/           # TypeScript definitions
│   ├── services/        # API service layer
│   ├── utils/           # Date utilities
│   └── styles/          # CSS modules
├── package.json
├── tsconfig.json
└── Documentation files
```

---

## 🚦 Next Steps

1. ✅ You're reading START_HERE.md
2. 📖 Read [README.md](./README.md) for full docs
3. 🛠️ Follow [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)
4. 💻 Try examples from [USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md)
5. 🎉 Start building!

---

## 💬 Support

- **GitHub**: https://github.com/splitleasesharath/virtual-meeting-manager
- **Issues**: https://github.com/splitleasesharath/virtual-meeting-manager/issues
- **Email**: support@splitlease.com

---

## 📄 License

MIT License - Free to use, modify, and distribute.

---

## 🙏 Credits

Created by Split Lease Team
Converted from Bubble.io by Claude Code
Version 1.0.0 (November 1, 2025)

---

**Ready to get started? Open [README.md](./README.md) for the full documentation!** 🎉
