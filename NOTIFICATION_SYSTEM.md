# Dynamic Push Notification System

## Overview

This system provides dynamic, personalized push notifications based on user data including startDate, selectedBuddy, gender, and language preferences. The notifications are scheduled using Firebase Firestore for persistence and OneSignal for remote push notifications.

## Architecture

### Components

1. **Notification Data** (`src/data/notificationData.ts`)
   - Contains all notification messages in Ukrainian, English, and Spanish
   - Structured by day, time of day, and category
   - Supports placeholder replacement (e.g., `{{buddy_name}}`)

2. **Notification Service** (`src/services/notificationService.ts`)
   - Firebase-based service for storing and managing notification settings
   - Handles user preferences and scheduled notifications
   - Integrates with OneSignal for remote push notifications
   - Manages notification permissions and delivery

3. **App Context Integration** (`src/contexts/AppContext.tsx`)
   - Provides notification functions throughout the app
   - Automatically schedules notifications after onboarding completion
   - Manages user settings and preferences

## Features

### Dynamic Content
- **Language Support**: Ukrainian (🇺🇦), English (🇬🇧), Spanish (🇪🇸)
- **Personalized Messages**: Uses buddy name and gender-specific content
- **Timing**: Morning (8:00 AM), Evening (8:00 PM), and Day notifications
- **Categories**: Start, Support, Celebration, Final milestones

### Scheduling Logic
- Notifications are scheduled based on user's `startDate`
- Only future notifications are scheduled (past notifications are skipped)
- Supports up to 365 days of notifications
- Automatic rescheduling when user settings change

### User Settings
```typescript
interface UserNotificationSettings {
  userId: string;
  language: 'ua' | 'en' | 'es';
  buddyName: string;
  gender: 'man' | 'lady' | 'any';
  startDate: Date;
  isEnabled: boolean;
  morningTime: string; // Format: "08:00"
  eveningTime: string; // Format: "20:00"
  timezone: string;
}
```

## Usage

### Initialization
The notification system is automatically initialized when a user completes onboarding:

```typescript
const completeOnboarding = useCallback(async () => {
  const startDate = new Date();
  setUserProgress((prev) => ({ ...prev, startDate }));
  await achievementService.setStartDate(startDate);
  
  // Initialize and schedule notifications
  await initializeNotifications();
  await scheduleUserNotifications();
}, []);
```

### Available Functions

```typescript
// Initialize the notification system
await initializeNotifications();

// Schedule notifications for the current user
await scheduleUserNotifications();

// Update notification settings
await updateNotificationSettings({
  morningTime: '09:00',
  eveningTime: '21:00',
  language: 'en'
});

// Send a test notification
await sendTestNotification();

// Get notification statistics
const stats = await getNotificationStats();
console.log(`Total scheduled: ${stats.totalScheduled}`);

// Check if notifications are enabled
const enabled = await areNotificationsEnabled();
```

## Notification Timeline

### First Week (Days 1-7)
- **Day 1 Morning**: Welcome message with buddy name
- **Day 1 Evening**: First evening encouragement
- **Day 2**: Daily support messages
- **Day 5**: Celebration for 5 days
- **Day 7**: Major milestone celebration

### Key Milestones
- **Day 10**: 10 days smoke-free
- **Day 14**: Two weeks milestone
- **Day 30**: One month celebration
- **Day 90**: Three months (legendary status)
- **Day 365**: One year achievement

### Categories
- **Start**: Initial welcome and journey beginning
- **Support**: Daily encouragement and tips
- **Celebration**: Milestone achievements
- **Final**: Major long-term achievements

## Firebase Collections

### `userNotificationSettings`
Stores user notification preferences:
```typescript
{
  userId: string;
  language: string;
  buddyName: string;
  gender: string;
  startDate: Timestamp;
  isEnabled: boolean;
  morningTime: string;
  eveningTime: string;
  timezone: string;
  lastNotificationSent?: Timestamp;
  updatedAt: Timestamp;
}
```

### `scheduledNotifications`
Stores individual scheduled notifications:
```typescript
{
  id: string;
  userId: string;
  notificationId: string;
  day: number;
  timeOfDay: 'morning' | 'evening' | 'day';
  scheduledTime: Timestamp;
  message: string;
  category: string;
  isSent: boolean;
  sentAt?: Timestamp;
  createdAt: Timestamp;
}
```

## Testing

Use the `NotificationTestPanel` component for testing:

```typescript
import NotificationTestPanel from '../components/NotificationTestPanel';

// In your component
<NotificationTestPanel onClose={() => setShowTestPanel(false)} />
```

The test panel provides:
- Current user settings display
- Notification statistics
- Initialize notifications
- Schedule user notifications
- Send test notification
- Update settings
- Refresh statistics

## Dependencies

Add to `package.json`:
```json
{
  "expo-notifications": "~0.28.0"
}
```

## Configuration

### Expo Configuration
Add to `app.json`:
```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#ffffff",
          "sounds": ["./assets/notification-sound.wav"]
        }
      ]
    ]
  }
}
```

### Firebase Security Rules
```javascript
// Firestore rules for notifications
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /userNotificationSettings/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /scheduledNotifications/{notificationId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

## Best Practices

1. **Permission Handling**: Always check and request notification permissions before scheduling
2. **Error Handling**: Implement proper error handling for Firebase operations
3. **Performance**: Limit the number of notifications processed in batch operations
4. **User Experience**: Allow users to customize notification times and frequency
5. **Testing**: Use the test panel to verify notification scheduling and delivery

## Troubleshooting

### Common Issues

1. **Notifications not appearing**
   - Check notification permissions
   - Verify Firebase configuration
   - Ensure proper timezone settings

2. **Messages not personalized**
   - Verify buddy name is set
   - Check language preference
   - Ensure placeholder replacement is working

3. **Scheduling issues**
   - Check startDate is properly set
   - Verify notification service initialization
   - Review Firebase connection

### Debug Information
Enable debug logging by setting log levels in the notification services:
```typescript
console.log('NotificationService: Debug mode enabled');
```

## Future Enhancements

1. **Smart Scheduling**: Adjust notification timing based on user behavior
2. **A/B Testing**: Test different message variations
3. **Analytics**: Track notification open rates and engagement
4. **Customization**: Allow users to create custom notification schedules
5. **Integration**: Connect with other app features for contextual notifications
