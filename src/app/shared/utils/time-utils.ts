export class TimeUtils {
    /**
     * Converts a timestamp to a human-readable "time ago" format.
     *
     * @param dateString The ISO timestamp string to format
     * @return A string representing how long ago the timestamp occurred
     */
    public static timeAgo(dateString: string): string {
        if (dateString == null) {
            return "";
        }
        const date = new Date(dateString);
        const now = new Date();

        // Calculate time differences
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        // Handle future dates (negative seconds)
        if (seconds < 0) {
            return TimeUtils.formatFutureTime(Math.abs(seconds));
        }

        // Handle past dates
        return TimeUtils.formatPastTime(seconds);
    }

    /**
     *
     * @param time
     * @returns
     */
    public static get24HoursTime(time: string): string {
        const [hourStr, min] = time.split(':');
        let hour = parseInt(hourStr, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12;
        return `${hour}:${min} ${ampm}`;
    }

    public static getDate_ISO(date: Date): string {
        return date.toISOString().split('T')[0]
    }

    /**
     * Formats a past time difference in seconds to a readable string.
     *
     * @param seconds Number of seconds in the past
     * @return Formatted time string
     */
    private static formatPastTime(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);

        if (years > 0) {
            return years === 1 ? '1 year ago' : `${years} years ago`;
        } else if (months > 0) {
            return months === 1 ? '1 month ago' : `${months} months ago`;
        } else if (days > 0) {
            return days === 1 ? '1 day ago' : `${days} days ago`;
        } else if (hours > 0) {
            return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
        } else if (minutes > 0) {
            return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
        } else {
            return seconds <= 1 ? 'just now' : `${seconds} seconds ago`;
        }
    }

    /**
     * Formats a future time difference in seconds to a readable string.
     *
     * @param seconds Number of seconds in the future
     * @return Formatted time string
     */
    private static formatFutureTime(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);

        if (years > 0) {
            return years === 1 ? 'in 1 year' : `in ${years} years`;
        } else if (months > 0) {
            return months === 1 ? 'in 1 month' : `in ${months} months`;
        } else if (days > 0) {
            return days === 1 ? 'in 1 day' : `in ${days} days`;
        } else if (hours > 0) {
            return hours === 1 ? 'in 1 hour' : `in ${hours} hours`;
        } else if (minutes > 0) {
            return minutes === 1 ? 'in 1 minute' : `in ${minutes} minutes`;
        } else {
            return seconds <= 1 ? 'just now' : `in ${seconds} seconds`;
        }
    }


}
