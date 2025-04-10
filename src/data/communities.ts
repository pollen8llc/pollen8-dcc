
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
  },
  {
    id: "2",
    name: "Digital Marketing Alliance",
    description: "Promoting our brand and driving customer engagement strategies",
    location: "New York, NY",
    imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.0.3",
    memberCount: 12,
    organizerIds: ["3"],
    memberIds: ["5", "9", "10", "11"],
    tags: ["Digital Marketing", "Content Creation", "Brand Strategy"],
    isPublic: true,
  },
  {
    id: "3",
    name: "Customer Success Network",
    description: "Supporting customers and ensuring satisfaction with our services",
    location: "San Francisco, CA",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3",
    memberCount: 18,
    organizerIds: ["4"],
    memberIds: ["12", "13", "14", "15"],
    tags: ["Customer Support", "Client Relations", "Onboarding"],
    isPublic: true,
  },
  {
    id: "4",
    name: "Design Collective",
    description: "Creating beautiful and functional design solutions",
    location: "London, UK",
    imageUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3",
    memberCount: 15,
    organizerIds: ["5"],
    memberIds: ["6", "16", "17", "18"],
    tags: ["UX Design", "Visual Design", "Brand Identity"],
    isPublic: true,
  },
  {
    id: "5",
    name: "Revenue Growth Partners",
    description: "Driving revenue and building client relationships",
    location: "Chicago, IL",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3",
    memberCount: 20,
    organizerIds: ["6"],
    memberIds: ["19", "20", "21", "22"],
    tags: ["B2B Sales", "Client Acquisition", "Revenue Growth"],
    isPublic: true,
  },
  {
    id: "6",
    name: "Innovation Lab",
    description: "Exploring new technologies and future product directions",
    location: "Berlin, Germany",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3",
    memberCount: 9,
    organizerIds: ["7"],
    memberIds: ["2", "8", "23", "24"],
    tags: ["R&D", "Innovation", "Emerging Tech"],
    isPublic: false,
  },
  {
    id: "8",
    name: "Tech Innovators Alliance",
    description: "A community of forward-thinking developers, engineers, and tech enthusiasts collaborating on cutting-edge projects and sharing knowledge about emerging technologies like AI, blockchain, and IoT.",
    location: "Austin, TX",
    imageUrl: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3",
    memberCount: 42,
    organizerIds: ["25"],
    memberIds: ["8", "14", "17"],
    tags: ["Technology", "Innovation", "Artificial Intelligence", "Blockchain"],
    isPublic: true,
  },
  {
    id: "9",
    name: "Sustainable Living Collective",
    description: "A group dedicated to promoting eco-friendly practices, sustainable living, and environmental conservation. Members share resources, organize workshops, and collaborate on community projects aimed at reducing carbon footprints.",
    location: "Portland, OR",
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1513&auto=format&fit=crop&ixlib=rb-4.0.3",
    memberCount: 31,
    organizerIds: ["4"],
    memberIds: ["5", "12", "19", "23"],
    tags: ["Sustainability", "Environment", "Green Living", "Community Action"],
    isPublic: true,
  }
];
