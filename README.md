# 🍽️ Simple Eat Diary

A modern, privacy-focused meal tracking application designed to help you monitor your daily eating habits and estimate monthly costs. Built with a "Zen Modern" aesthetic, it combines simplicity with powerful features like Nepali Calendar support and offline-first PWA capabilities.

## ✨ Key Features

### 📅 Smart Calendar
*   **Nepali Calendar (Bikram Sambat)**: Fully integrated BS calendar for users in Nepal, with accurate month/date conversion.
*   **Implicit Tracking**: Simple daily toggle for "Morning" and "Night" meals. Unmarked days are automatically treated as skipped.
*   **Monthly Overview**: Visual grid showing your streak.
    *   🟢 **Green**: Both meals eaten.
    *   🟡 **Yellow**: One meal eaten.
    *   🔴 **Red**: Both meals skipped (but day passed).

### 📱 Progressive Web App (PWA)
*   **Install Everywhere**: Works as a native app on Android, iOS, and Desktop.
*   **Universal Install Banner**: Smart detection prompts you to install on compatible devices or guides you manually (e.g., on iOS).
*   **Offline Support**: View your history even without internet access.

### 🛡️ Privacy & Security
*   **PIN Protection**: Secure your historic data. Critical actions like "Reset Data" require your PIN verification.
*   **Local First**: Optimized for speed and privacy.

### 💰 Cost Estimation
*   **Budget Tracking**: Set your "Price Per Meal" in Settings.
*   **Real-time Calc**: Instantly see your estimated monthly expense based on consumption.

<img width="1440" height="900" alt="Screenshot 2026-01-21 at 2 37 36 am" src="https://github.com/user-attachments/assets/a4232257-cc2e-47c1-9052-008b02c47d32" />

<img width="1440" height="900" alt="Screenshot 2026-01-21 at 2 38 10 am" src="https://github.com/user-attachments/assets/44db061c-2dd0-40aa-a38e-bffc76b6bcc4" />
<img width="1440" height="900" alt="Screenshot 2026-01-21 at 2 38 26 am" src="https://github.com/user-attachments/assets/42ae62ee-b985-48fa-b959-f9373a270610" />
<img width="1440" height="900" alt="Screenshot 2026-01-21 at 2 38 37 am" src="https://github.com/user-attachments/assets/fb2fd179-5e03-4128-b353-1b10ad3b50b2" />



## 🛠️ Tech Stack

*   **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **State/Data**: Context API + Firebase (Firestore/Auth)
*   **PWA**: [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)

## 🚀 Getting Started

### Prerequisites
*   Node.js & npm (or bun/yarn)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/simple-eat-diary.git
    cd simple-eat-diary
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    bun install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory with your Firebase config:
    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

## 📱 Mobile Installation Guide

### Android
1.  Open Chrome.
2.  Tap "Install" on the bottom banner OR tap the **three dots** menu -> **Install App**.

### iOS (iPhone/iPad)
1.  Open Safari.
2.  Tap the **Share** button.
3.  Scroll down and select **Add to Home Screen**.

## 📄 License
MIT License - build mostly for personal use but free to fork and adapt!
