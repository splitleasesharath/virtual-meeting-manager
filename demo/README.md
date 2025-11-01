# Virtual Meeting Manager - Local Preview Demo

## 🎯 Quick Start

### Option 1: Open in Browser (Easiest)

Simply double-click the `index.html` file in this folder to open it in your default browser.

Or navigate to:
```
C:\Users\Split Lease\My Drive\!Agent Context and Tools\SL16\virtual-meeting-manager\demo\index.html
```

### Option 2: Using a Local Server (Recommended)

For the best experience, serve the demo through a local web server:

**Using Python:**
```bash
# Navigate to the demo folder
cd "C:\Users\Split Lease\My Drive\!Agent Context and Tools\SL16\virtual-meeting-manager\demo"

# Python 3
python -m http.server 8000

# Then open: http://localhost:8000
```

**Using Node.js (http-server):**
```bash
# Install http-server globally (one time)
npm install -g http-server

# Navigate to demo folder and serve
cd "C:\Users\Split Lease\My Drive\!Agent Context and Tools\SL16\virtual-meeting-manager\demo"
http-server -p 8000

# Then open: http://localhost:8000
```

**Using VS Code Live Server:**
1. Install "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"

---

## 📋 What You'll See

The demo shows **static HTML mockups** of all 4 views:

### 1. Respond to VM Request
- Time slot radio buttons
- Decline button
- Suggest alternatives button
- Confirmation dialog mockup

### 2. Request Virtual Meeting
- Interactive calendar grid
- Selected time slots display
- Submit button (with validation state)

### 3. Cancel Virtual Meeting
- Warning message
- Meeting details card
- Confirmation buttons

### 4. Meeting Details
- Profile photo
- Booked date/time
- Meeting information
- Google Calendar button
- Google Meet link

---

## ⚠️ Important Notes

### This is NOT the Full React Component

This demo is a **static HTML preview** only. It shows:
- ✅ Visual design and layout
- ✅ UI components and styling
- ✅ View structure
- ✅ Sample data presentation

It does NOT include:
- ❌ Actual React functionality
- ❌ State management
- ❌ API calls
- ❌ Real calendar interaction
- ❌ Form validation
- ❌ Data persistence

### To Use the Real Component

You need to:
1. Install dependencies: `npm install`
2. Build the project: `npm run build`
3. Import into a React application
4. Connect to Bubble.io backend

See the main [README.md](../README.md) for full instructions.

---

## 🎨 Testing the Demo

Click the buttons at the top to switch between views:

1. **📋 Respond to Request** - See the time slot selection interface
2. **📅 Request Meeting** - View the calendar and slot selection
3. **❌ Cancel Meeting** - See the cancellation confirmation
4. **ℹ️ View Details** - Display meeting information

Each view opens in a modal and shows how the component will look with sample data.

---

## 📱 Responsive Testing

The demo is responsive! Try:
- Resizing your browser window
- Opening on mobile devices
- Testing different screen sizes

All components adapt to different viewport sizes.

---

## 🔧 Customization

To customize the demo styling, edit `index.html` and modify:

**Colors:**
```css
background: #7b2cbf;  /* Primary purple */
background: #dc2626;  /* Danger red */
background: #10b981;  /* Success green */
```

**Layout:**
```css
max-width: 1200px;    /* Container width */
padding: 20px;        /* Spacing */
border-radius: 12px;  /* Border radius */
```

---

## 🚀 Next Steps

After reviewing the demo:

1. **Read the Documentation**
   - [README.md](../README.md) - Complete guide
   - [IMPLEMENTATION_GUIDE.md](../IMPLEMENTATION_GUIDE.md) - Setup instructions
   - [USAGE_EXAMPLES.md](../USAGE_EXAMPLES.md) - Code examples

2. **Build the Real Component**
   ```bash
   cd ..
   npm install
   npm run build
   ```

3. **Integrate into Your App**
   ```tsx
   import { VirtualMeetingManager } from 'virtual-meeting-manager';
   ```

---

## 📂 File Structure

```
demo/
├── index.html     # Main demo file (this is what you open)
└── README.md      # This file
```

---

## 💡 Tips

- **Keyboard Navigation**: Press `ESC` to close modals
- **Click Outside**: Click the dark overlay to close modals
- **Sample Data**: All data shown is mock data for demonstration
- **Styling**: The actual component uses CSS modules for scoped styling

---

## 🐛 Demo Limitations

This HTML demo has limitations:
- No real calendar interaction (dates are static)
- Buttons don't trigger actual API calls
- Form validation is visual only
- Time zones are displayed but not calculated
- No error handling or loading states

These features work in the actual React component!

---

## 📞 Support

Questions about the demo?
- Check [README.md](../README.md) for component documentation
- See [IMPLEMENTATION_GUIDE.md](../IMPLEMENTATION_GUIDE.md) for setup help
- Visit: https://github.com/splitleasesharath/virtual-meeting-manager

---

## ✅ Checklist

Before using the real component:
- [ ] Reviewed the demo
- [ ] Read START_HERE.md
- [ ] Read README.md
- [ ] Installed dependencies (`npm install`)
- [ ] Built the project (`npm run build`)
- [ ] Configured `.env` file
- [ ] Set up Bubble.io backend

---

**Enjoy exploring the Virtual Meeting Manager demo!** 🎉

For the full experience, build and integrate the real React component.
