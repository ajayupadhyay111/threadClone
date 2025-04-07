export const formatPostTime = (createdAt) => {
    const postDate = new Date(createdAt);
    const currentDate = new Date();
  
    const diffMs = currentDate - postDate; // Time difference in milliseconds
    const diffSeconds = Math.floor(diffMs / 1000); // Convert to seconds
    const diffMinutes = Math.floor(diffSeconds / 60); // Convert to minutes
    const diffHours = Math.floor(diffMinutes / 60); // Convert to hours
  
    if (diffMinutes < 1) {
      return `${diffSeconds}s`; // Show seconds if less than 1 minute
    } else if (diffHours < 1) {
      return `${diffMinutes}m`; // Show minutes if less than 1 hour
    } else if (diffHours < 24) {
      return `${diffHours}h`; // Show hours if less than 24 hours
    } else if (diffHours < 48) {
      return "Yesterday"; // Show "Yesterday" if between 24h - 48h
    } else {
      return postDate.toLocaleDateString("en-US"); // Show date in mm/dd/yy format
    }
};
