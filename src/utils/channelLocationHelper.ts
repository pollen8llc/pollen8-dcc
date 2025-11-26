/**
 * Channel Location Helper
 * Derives location string from trigger/outreach channel information
 */

export const getLocationFromChannel = (
  outreachChannel?: string | null,
  channelDetails?: Record<string, any> | null
): string => {
  if (!outreachChannel || !channelDetails) {
    return "REL8 Platform";
  }

  switch (outreachChannel) {
    case "text":
    case "call":
      return channelDetails.phone ? `Phone: ${channelDetails.phone}` : "Phone";
    
    case "email":
      return channelDetails.email ? `Email: ${channelDetails.email}` : "Email";
    
    case "dm":
      return channelDetails.platform && channelDetails.handle 
        ? `${channelDetails.platform}: @${channelDetails.handle}` 
        : "Direct Message";
    
    case "meeting":
      return channelDetails.link || "Virtual Meeting";
    
    case "irl":
      return channelDetails.address || "In-Person Meeting";
    
    default:
      return "REL8 Platform";
  }
};
