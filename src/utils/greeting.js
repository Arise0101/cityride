/**
 * CITYRIDE Time-Aware Greeting Utility
 * Automatically returns greeting based on current local device time:
 * 5:00 AM – 11:59 AM  => Good Morning 👋
 * 12:00 PM – 4:59 PM  => Good Afternoon 👋
 * 5:00 PM – 8:59 PM   => Good Evening 👋
 * 9:00 PM – 4:59 AM   => Good Night 🌙
 */

export function getTimeAwareGreeting(date = new Date()) {
  const hours = date.getHours();

  if (hours >= 5 && hours < 12) {
    return {
      text: "Good Morning 👋",
      subtext: "Where do you want to go in the city today?",
      icon: "☀️"
    };
  } else if (hours >= 12 && hours < 17) {
    return {
      text: "Good Afternoon 👋",
      subtext: "Plan your afternoon journey across Tumakuru.",
      icon: "🌤️"
    };
  } else if (hours >= 17 && hours < 21) {
    return {
      text: "Good Evening 👋",
      subtext: "Heading back home or exploring Tumakuru city tonight?",
      icon: "🌇"
    };
  } else {
    return {
      text: "Good Night 🌙",
      subtext: "Night buses are running on key city routes.",
      icon: "🌙"
    };
  }
}
