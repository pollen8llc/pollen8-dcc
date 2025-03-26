import { User, Community, Role } from "./types";

export const communities: Community[] = [
  {
    id: "1",
    name: "Product Development",
    description: "Team focused on building and improving our product offerings",
    location: "Global (Remote)",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3",
    memberCount: 24,
    organizerIds: ["1", "2"],
    memberIds: ["3", "4", "5", "6", "7", "8"],
    tags: ["Engineering", "Design", "Product Management"],
    isPublic: true,
  },
  {
    id: "2",
    name: "Marketing Team",
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
    name: "Customer Success",
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
    name: "Design Studio",
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
    name: "Sales Department",
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
    name: "Research & Innovation",
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
    id: "7",
    name: "Humanize HQ",
    description: "Supporting early-stage founders through community, resources, and meaningful connections that emphasize the human element of entrepreneurship.",
    location: "Remote",
    imageUrl: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3",
    memberCount: 67,
    organizerIds: ["25"],
    memberIds: [],
    tags: ["Entrepreneurship", "Networking", "Founder Support"],
    isPublic: true,
  },
];

export const users: User[] = [
  {
    id: "1",
    name: "Alex Morgan",
    role: Role.ORGANIZER,
    imageUrl: "https://randomuser.me/api/portraits/women/1.jpg",
    email: "alex.morgan@example.com",
    bio: "Product leader with 8+ years of experience in SaaS",
    communities: ["1"],
  },
  {
    id: "2",
    name: "Jordan Lee",
    role: Role.ORGANIZER,
    imageUrl: "https://randomuser.me/api/portraits/men/2.jpg",
    email: "jordan.lee@example.com",
    bio: "Engineering Director focused on scalable architecture",
    communities: ["1", "6"],
  },
  {
    id: "3",
    name: "Taylor Kim",
    role: Role.ORGANIZER,
    imageUrl: "https://randomuser.me/api/portraits/women/3.jpg",
    email: "taylor.kim@example.com",
    bio: "Marketing lead specializing in growth strategies",
    communities: ["2"],
  },
  {
    id: "4",
    name: "Casey Rivera",
    role: Role.ORGANIZER,
    imageUrl: "https://randomuser.me/api/portraits/men/4.jpg",
    email: "casey.rivera@example.com",
    bio: "Customer experience expert with focus on retention",
    communities: ["3"],
  },
  {
    id: "5",
    name: "Morgan Chen",
    role: Role.ORGANIZER,
    imageUrl: "https://randomuser.me/api/portraits/women/5.jpg",
    email: "morgan.chen@example.com",
    bio: "Design Director with background in human-centered design",
    communities: ["4"],
  },
  {
    id: "6",
    name: "Avery Johnson",
    role: Role.ORGANIZER,
    imageUrl: "https://randomuser.me/api/portraits/men/6.jpg",
    email: "avery.johnson@example.com",
    bio: "Sales leader driving enterprise partnerships",
    communities: ["5"],
  },
  {
    id: "7",
    name: "Riley Patel",
    role: Role.ORGANIZER,
    imageUrl: "https://randomuser.me/api/portraits/women/7.jpg",
    email: "riley.patel@example.com",
    bio: "Innovation strategist with background in R&D",
    communities: ["6"],
  },
  {
    id: "8",
    name: "Cameron Smith",
    role: Role.MEMBER,
    imageUrl: "https://randomuser.me/api/portraits/men/8.jpg",
    email: "cameron.smith@example.com",
    bio: "Full-stack developer specializing in React and Node.js",
    communities: ["1", "6"],
  },
  {
    id: "9",
    name: "Quinn Wilson",
    role: Role.MEMBER,
    imageUrl: "https://randomuser.me/api/portraits/women/9.jpg",
    email: "quinn.wilson@example.com",
    bio: "Content strategist and copywriter",
    communities: ["2"],
  },
  {
    id: "10",
    name: "Reese Garcia",
    role: Role.MEMBER,
    imageUrl: "https://randomuser.me/api/portraits/men/10.jpg",
    email: "reese.garcia@example.com",
    bio: "Digital marketing specialist with focus on SEO/SEM",
    communities: ["2"],
  },
  {
    id: "11",
    name: "Dakota Martin",
    role: Role.MEMBER,
    imageUrl: "https://randomuser.me/api/portraits/women/11.jpg",
    email: "dakota.martin@example.com",
    bio: "Social media manager and community builder",
    communities: ["2"],
  },
  {
    id: "12",
    name: "Skyler Adams",
    role: Role.MEMBER,
    imageUrl: "https://randomuser.me/api/portraits/men/12.jpg",
    email: "skyler.adams@example.com",
    bio: "Customer support specialist with technical expertise",
    communities: ["3"],
  },
  {
    id: "13",
    name: "Hayden Lopez",
    role: Role.MEMBER,
    imageUrl: "https://randomuser.me/api/portraits/women/13.jpg",
    email: "hayden.lopez@example.com",
    bio: "Account manager focused on client success",
    communities: ["3"],
  },
  {
    id: "14",
    name: "Parker Taylor",
    role: Role.MEMBER,
    imageUrl: "https://randomuser.me/api/portraits/men/14.jpg",
    email: "parker.taylor@example.com",
    bio: "Implementation specialist helping clients onboard",
    communities: ["3"],
  },
  {
    id: "15",
    name: "Finley Robinson",
    role: Role.MEMBER,
    imageUrl: "https://randomuser.me/api/portraits/women/15.jpg",
    email: "finley.robinson@example.com",
    bio: "Customer advocate with passion for user experience",
    communities: ["3"],
  },
  {
    id: "16",
    name: "Sawyer Nguyen",
    role: Role.MEMBER,
    imageUrl: "https://randomuser.me/api/portraits/men/16.jpg",
    email: "sawyer.nguyen@example.com",
    bio: "UI designer specializing in design systems",
    communities: ["4"],
  },
  {
    id: "17",
    name: "Rowan Bailey",
    role: Role.MEMBER,
    imageUrl: "https://randomuser.me/api/portraits/women/17.jpg",
    email: "rowan.bailey@example.com",
    bio: "UX researcher conducting user studies and testing",
    communities: ["4"],
  },
  {
    id: "18",
    name: "Drew Foster",
    role: Role.MEMBER,
    imageUrl: "https://randomuser.me/api/portraits/men/18.jpg",
    email: "drew.foster@example.com",
    bio: "Brand designer with focus on identity and experience",
    communities: ["4"],
  },
  {
    id: "19",
    name: "Blake Carter",
    role: Role.MEMBER,
    imageUrl: "https://randomuser.me/api/portraits/women/19.jpg",
    email: "blake.carter@example.com",
    bio: "Sales executive for enterprise accounts",
    communities: ["5"],
  },
  {
    id: "20",
    name: "Jordan Scott",
    role: Role.MEMBER,
    imageUrl: "https://randomuser.me/api/portraits/men/20.jpg",
    email: "jordan.scott@example.com",
    bio: "Business development manager exploring new markets",
    communities: ["5"],
  },
  {
    id: "21",
    name: "Elliott Hayes",
    role: Role.MEMBER,
    imageUrl: "https://randomuser.me/api/portraits/women/21.jpg",
    email: "elliott.hayes@example.com",
    bio: "Sales operations coordinating team efforts",
    communities: ["5"],
  },
  {
    id: "22",
    name: "Kai Mitchell",
    role: Role.MEMBER,
    imageUrl: "https://randomuser.me/api/portraits/men/22.jpg",
    email: "kai.mitchell@example.com",
    bio: "Account executive with focus on relationship building",
    communities: ["5"],
  },
  {
    id: "23",
    name: "Peyton Turner",
    role: Role.MEMBER,
    imageUrl: "https://randomuser.me/api/portraits/women/23.jpg",
    email: "peyton.turner@example.com",
    bio: "Research scientist exploring emerging technologies",
    communities: ["6"],
  },
  {
    id: "24",
    name: "Emerson Clark",
    role: Role.MEMBER,
    imageUrl: "https://randomuser.me/api/portraits/men/24.jpg",
    email: "emerson.clark@example.com",
    bio: "Prototyping specialist building proof of concepts",
    communities: ["6"],
  },
  {
    id: "25",
    name: "Larissa Carrera",
    role: Role.ORGANIZER,
    imageUrl: "https://randomuser.me/api/portraits/women/25.jpg",
    email: "larissa.carrera@humanizehq.com",
    bio: "Operations professional with experience in family office and venture investments. Founder of Humanize HQ, supporting early-stage founders through community and resources.",
    communities: ["7"],
  },
];

export const getCommunityById = (id: string): Community | undefined => {
  return communities.find((community) => community.id === id);
};

export const getUserById = (id: string): User | undefined => {
  return users.find((user) => user.id === id);
};

export const getCommunityMembers = (communityId: string): User[] => {
  const community = getCommunityById(communityId);
  if (!community) return [];
  
  return [
    ...users.filter((user) => community.organizerIds.includes(user.id)),
    ...users.filter((user) => community.memberIds.includes(user.id))
  ];
};

export const getCommunityOrganizers = (communityId: string): User[] => {
  const community = getCommunityById(communityId);
  if (!community) return [];
  
  return users.filter((user) => community.organizerIds.includes(user.id));
};

export const getCommunityRegularMembers = (communityId: string): User[] => {
  const community = getCommunityById(communityId);
  if (!community) return [];
  
  return users.filter((user) => community.memberIds.includes(user.id));
};
