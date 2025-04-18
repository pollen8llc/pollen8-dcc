
import { Community } from "./types";

export const communities: Community[] = [
  {
    id: "10",
    name: "NIN (Nigerians in New York)",
    description: "A vibrant community for Nigerians living in New York, started as a soccer watch party group and evolved into a comprehensive platform with 700+ members across various interest areas including career development, fitness, and investments.",
    location: "New York, NY",
    imageUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3",
    memberCount: 700,
    organizerIds: ["25"],
    memberIds: [],
    tags: ["Nigerian Diaspora", "Professional Networking", "Cultural Community", "NYC"],
    isPublic: true,
  },
  {
    id: "7",
    name: "Humanize HQ",
    description: "Humanize HQ focuses on providing support, networking, and resources to early-stage founders who lack established networks. The organization emphasizes the human element of entrepreneurship, recognizing that while monetary investments are important, the people building companies often get overlooked.",
    location: "NY",
    imageUrl: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3",
    memberCount: 67,
    organizerIds: ["25"],
    memberIds: [],
    tags: ["Entrepreneurship", "Networking", "Founder Support"],
    isPublic: true,
  }
];

