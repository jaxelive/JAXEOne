
/**
 * Converts 24-hour time format to 12-hour format without AM/PM
 * @param time24 - Time string in 24-hour format (e.g., "17:00", "09:30") or already formatted 12-hour (e.g., "5:00 PM")
 * @returns Time string in 12-hour format without AM/PM (e.g., "5:00", "9:30")
 */
export function formatTo12Hour(time24: string): string {
  if (!time24) return '';
  
  try {
    // Check if already in 12-hour format with AM/PM
    if (time24.includes('AM') || time24.includes('PM') || time24.includes('am') || time24.includes('pm')) {
      // Remove AM/PM and trim
      return time24.replace(/\s*(AM|PM|am|pm)\s*/g, '').trim();
    }
    
    // Split the time string
    const [hoursStr, minutesStr] = time24.split(':');
    let hours = parseInt(hoursStr, 10);
    const minutes = minutesStr || '00';
    
    // Convert to 12-hour format
    if (hours === 0) {
      hours = 12; // Midnight
    } else if (hours > 12) {
      hours = hours - 12;
    }
    
    // Format the time without AM/PM
    return `${hours}:${minutes}`;
  } catch (error) {
    console.error('[timeFormat] Error converting time:', error);
    return time24; // Return original if conversion fails
  }
}
