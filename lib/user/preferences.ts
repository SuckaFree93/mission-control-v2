import fs from 'fs/promises';
import path from 'path';

export interface UserPreferences {
  userId: string;
  theme: 'dark' | 'light' | 'auto';
  layout: 'compact' | 'spacious' | 'custom';
  dashboard: {
    widgets: string[];
    columns: number;
    autoRefresh: boolean;
    refreshInterval: number; // seconds
  };
  notifications: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
    email: boolean;
    push: boolean;
  };
  shortcuts: Record<string, string>;
  lastActive: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  userId: string;
  displayName: string;
  email?: string;
  avatar?: string;
  role: 'admin' | 'user' | 'viewer';
  permissions: string[];
  preferences: UserPreferences;
}

export class UserPreferencesService {
  private dataDir: string;
  private preferencesFile: string;
  private profilesFile: string;

  constructor() {
    this.dataDir = path.join(process.cwd(), 'data', 'users');
    this.preferencesFile = path.join(this.dataDir, 'preferences.json');
    this.profilesFile = path.join(this.dataDir, 'profiles.json');
    this.ensureDataDirectory();
  }

  private async ensureDataDirectory() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
      
      // Initialize files if they don't exist
      const [prefsExists, profilesExists] = await Promise.all([
        fs.access(this.preferencesFile).then(() => true).catch(() => false),
        fs.access(this.profilesFile).then(() => true).catch(() => false)
      ]);

      if (!prefsExists) {
        await fs.writeFile(this.preferencesFile, JSON.stringify({}, null, 2));
      }

      if (!profilesExists) {
        await fs.writeFile(this.profilesFile, JSON.stringify({}, null, 2));
      }
    } catch (error) {
      console.error('Error ensuring data directory:', error);
    }
  }

  private getDefaultPreferences(userId: string): UserPreferences {
    return {
      userId,
      theme: 'dark',
      layout: 'spacious',
      dashboard: {
        widgets: ['system_metrics', 'agent_status', 'recent_activity', 'performance_chart'],
        columns: 3,
        autoRefresh: true,
        refreshInterval: 30
      },
      notifications: {
        enabled: true,
        sound: true,
        desktop: true,
        email: false,
        push: false
      },
      shortcuts: {
        'toggle_sidebar': 'Ctrl+B',
        'command_palette': 'Ctrl+K',
        'refresh_dashboard': 'Ctrl+R',
        'dark_mode': 'Ctrl+D'
      },
      lastActive: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  private getDefaultProfile(userId: string, displayName: string): UserProfile {
    return {
      userId,
      displayName,
      role: 'user',
      permissions: ['view_dashboard', 'edit_preferences'],
      preferences: this.getDefaultPreferences(userId)
    };
  }

  async getUserPreferences(userId: string): Promise<UserPreferences> {
    try {
      const data = await fs.readFile(this.preferencesFile, 'utf-8');
      const preferences = JSON.parse(data);
      
      if (preferences[userId]) {
        // Update last active timestamp
        preferences[userId].lastActive = new Date().toISOString();
        await this.savePreferences(preferences);
        return preferences[userId];
      }
      
      // Create default preferences for new user
      const defaultPrefs = this.getDefaultPreferences(userId);
      preferences[userId] = defaultPrefs;
      await this.savePreferences(preferences);
      
      return defaultPrefs;
    } catch (error) {
      console.error('Error reading user preferences:', error);
      return this.getDefaultPreferences(userId);
    }
  }

  async updateUserPreferences(userId: string, updates: Partial<UserPreferences>): Promise<UserPreferences> {
    try {
      const data = await fs.readFile(this.preferencesFile, 'utf-8');
      const preferences = JSON.parse(data);
      
      const currentPrefs = preferences[userId] || this.getDefaultPreferences(userId);
      const updatedPrefs = {
        ...currentPrefs,
        ...updates,
        updatedAt: new Date().toISOString(),
        userId // Ensure userId is preserved
      };
      
      preferences[userId] = updatedPrefs;
      await this.savePreferences(preferences);
      
      return updatedPrefs;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const data = await fs.readFile(this.profilesFile, 'utf-8');
      const profiles = JSON.parse(data);
      
      if (profiles[userId]) {
        return profiles[userId];
      }
      
      // Create default profile for new user
      const defaultProfile = this.getDefaultProfile(userId, `User ${userId.substring(0, 8)}`);
      profiles[userId] = defaultProfile;
      await this.saveProfiles(profiles);
      
      return defaultProfile;
    } catch (error) {
      console.error('Error reading user profile:', error);
      return this.getDefaultProfile(userId, `User ${userId.substring(0, 8)}`);
    }
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const data = await fs.readFile(this.profilesFile, 'utf-8');
      const profiles = JSON.parse(data);
      
      const currentProfile = profiles[userId] || this.getDefaultProfile(userId, `User ${userId.substring(0, 8)}`);
      const updatedProfile = {
        ...currentProfile,
        ...updates,
        userId // Ensure userId is preserved
      };
      
      profiles[userId] = updatedProfile;
      await this.saveProfiles(profiles);
      
      return updatedProfile;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  async getAllUsers(): Promise<UserProfile[]> {
    try {
      const data = await fs.readFile(this.profilesFile, 'utf-8');
      const profiles = JSON.parse(data);
      return Object.values(profiles);
    } catch (error) {
      console.error('Error reading all users:', error);
      return [];
    }
  }

  async deleteUser(userId: string): Promise<boolean> {
    try {
      const [prefsData, profilesData] = await Promise.all([
        fs.readFile(this.preferencesFile, 'utf-8'),
        fs.readFile(this.profilesFile, 'utf-8')
      ]);
      
      const preferences = JSON.parse(prefsData);
      const profiles = JSON.parse(profilesData);
      
      delete preferences[userId];
      delete profiles[userId];
      
      await Promise.all([
        this.savePreferences(preferences),
        this.saveProfiles(profiles)
      ]);
      
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  private async savePreferences(preferences: Record<string, UserPreferences>) {
    await fs.writeFile(this.preferencesFile, JSON.stringify(preferences, null, 2));
  }

  private async saveProfiles(profiles: Record<string, UserProfile>) {
    await fs.writeFile(this.profilesFile, JSON.stringify(profiles, null, 2));
  }

  // Theme management
  async setTheme(userId: string, theme: 'dark' | 'light' | 'auto'): Promise<UserPreferences> {
    return this.updateUserPreferences(userId, { theme });
  }

  // Layout management
  async setLayout(userId: string, layout: 'compact' | 'spacious' | 'custom'): Promise<UserPreferences> {
    return this.updateUserPreferences(userId, { layout });
  }

  // Dashboard widget management
  async updateDashboardWidgets(userId: string, widgets: string[]): Promise<UserPreferences> {
    const prefs = await this.getUserPreferences(userId);
    return this.updateUserPreferences(userId, {
      dashboard: { ...prefs.dashboard, widgets }
    });
  }

  // Notification settings
  async updateNotificationSettings(userId: string, settings: Partial<UserPreferences['notifications']>): Promise<UserPreferences> {
    const prefs = await this.getUserPreferences(userId);
    return this.updateUserPreferences(userId, {
      notifications: { ...prefs.notifications, ...settings }
    });
  }

  // Shortcut management
  async setShortcut(userId: string, action: string, shortcut: string): Promise<UserPreferences> {
    const prefs = await this.getUserPreferences(userId);
    const shortcuts = { ...prefs.shortcuts, [action]: shortcut };
    return this.updateUserPreferences(userId, { shortcuts });
  }
}