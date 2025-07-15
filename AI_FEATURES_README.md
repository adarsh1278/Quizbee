# QuizBee - AI-Powered Quiz Generator

## 🚀 Latest Updates

### ✨ New Features Added
- **Quiz Title Input**: Add a proper title for your quiz at the top
- **Environment API Key**: Gemini API key is now fetched from environment variables
- **Simplified UI**: Removed old question status concept for cleaner interface
- **Top-Level Quiz Creation**: Quiz title and main actions are prominently displayed at the top

### 🤖 AI Quiz Generator
Generate quiz questions automatically using Google's Gemini AI with just a topic description.

**Features:**
- **Environment Integration**: API key fetched from `.env.local` file
- **Fallback Manual Entry**: Option to enter API key manually if not in environment
- Generate 3-20 questions at once
- Topic-based question generation (max 10 words)
- Adjustable difficulty levels (Easy, Medium, Hard)
- Customizable marks and time per question
- Professional MCQ format with 4 options

### 🎨 Improved UI/UX
- **Top-Level Title Input**: Prominent quiz title field at the top of the page
- **Action Buttons at Top**: "Add Question Manually" and "Generate with AI" buttons moved to header
- **Cleaner Interface**: Removed unnecessary status indicators and old question concepts
- **Minimalistic Design**: Clean, modern interface with glassmorphism effects
- **Transparent Elements**: Subtle backgrounds with backdrop blur effects
- **Improved Select Components**: Removed annoying blue borders, added smooth transitions
- **Enhanced Sidebar**: Better question overview with visual indicators
- **Responsive Layout**: Optimized for different screen sizes

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Gemini API (Recommended)
1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create/edit `.env.local` file in the project root
3. Add your API key:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
   ```

### 3. Run Development Server
```bash
npm run dev
```

## 🎯 How to Use

### Creating a Quiz
1. **Navigate to Create Quiz**: Go to `/dashboard/create`
2. **Enter Quiz Title**: Add a descriptive title for your quiz in the header section
3. **Add Questions**: Choose between:
   - **Manual**: Click "Add Question Manually" to create questions step by step
   - **AI Generated**: Click "Generate with AI" for automatic question creation

### Using AI Generator
1. **API Key**: If you've set up the environment variable, it will be detected automatically
2. **Manual Entry**: If no environment key is found, you can enter it manually in the modal
3. **Describe Topic**: Enter topic in 10 words or less (e.g., "JavaScript fundamentals", "World War II")
4. **Configure Settings**:
   - Number of questions (3-20)
   - Difficulty level
   - Marks per question
   - Time per question
5. **Generate**: Click "Generate Questions" and wait for AI to create your quiz

## 🎨 UI Improvements

### Header Section
- **Prominent Quiz Title**: Large input field for quiz name
- **Action Buttons**: Quick access to manual and AI question creation
- **Glass Card Design**: Modern transparent card with blur effects

### Question Management
- **Clean Layout**: Questions displayed in organized cards
- **No Status Clutter**: Removed old/new status indicators for cleaner look
- **Smooth Navigation**: Sidebar navigation to jump between questions
- **Visual Feedback**: Hover states and smooth transitions

### AI Modal
- **Smart API Detection**: Automatically detects if API key is in environment
- **Conditional UI**: Shows different interfaces based on API key availability
- **Better Validation**: Clear error messages and input validation
- **Professional Layout**: Well-organized form with logical grouping

## 📁 Updated File Structure

```
src/
├── app/dashboard/create/
│   ├── page.tsx              # Main create page with title input
│   ├── AIQuizGenerator.tsx   # Enhanced AI modal with env support
│   ├── QuizSidebar.tsx       # Clean sidebar without status
│   └── Question.tsx          # Question component
├── lib/
│   └── gemini.ts             # Enhanced AI service with env support
└── .env.local                # Environment variables (you create this)
```

## 🔧 Technical Improvements

### Environment Integration
- **Automatic API Key Detection**: Checks for `NEXT_PUBLIC_GEMINI_API_KEY`
- **Graceful Fallback**: Manual entry option if env var not found
- **Better Error Handling**: Clear messaging about API key status

### Simplified Data Model
- **Removed Status Field**: No more old/new question tracking
- **Cleaner Types**: Simplified Question interface
- **Consistent State**: All questions treated equally

### Enhanced UX
- **Progressive Disclosure**: Shows API input only when needed
- **Clear Visual Hierarchy**: Title at top, actions next, questions below
- **Better Information Architecture**: Logical flow from title to content to submission

## 🎨 Color Scheme & Design

- **Header Cards**: White with 70% opacity and backdrop blur
- **Question Area**: White with 50% opacity and backdrop blur  
- **Primary Actions**: Purple to pink gradients
- **Secondary Actions**: Gray scale for hierarchy
- **Background**: Soft gray gradients
- **Text**: Gray scale for proper contrast

## 📱 Responsive Design

- **Desktop**: Full sidebar with detailed question cards
- **Tablet**: Collapsible sidebar, maintained header layout
- **Mobile**: Stacked layout with optimized header

## 🚀 What's New Summary

✅ **Quiz title input at the top**  
✅ **Gemini API from environment variables**  
✅ **Removed old question status concept**  
✅ **Top-level create quiz interface**  
✅ **Smart API key detection**  
✅ **Cleaner, more professional UI**  
✅ **Better error handling and validation**  
✅ **Improved user experience flow**

---

**Note**: For the best experience, set up your Gemini API key in the `.env.local` file. The UI will automatically detect and use it, providing a seamless quiz generation experience.
