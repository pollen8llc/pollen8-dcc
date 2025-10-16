# World Map - Technical Documentation

## Overview
Interactive world map component with drill-down functionality allowing users to navigate from global view → USA → individual states.

## Libraries Required

### Core Dependencies
```json
{
  "react-simple-maps": "^3.0.0",
  "lucide-react": "^0.462.0"
}
```

### Data Sources
- **World Atlas**: `https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json`
- **USA Atlas**: `https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json`

## Design Tokens

### Color Palette (HSL)
All colors use semantic tokens from the design system defined in `index.css`:

```css
--primary: /* Primary brand color */
--background: /* Background color */
--foreground: /* Text color */
--muted-foreground: /* Secondary text */
--card: /* Card background */
--border: /* Border color */
```

### Color Usage
- **Geography Fill**: `hsl(var(--primary))` at 95% opacity
- **Geography Stroke**: `hsl(var(--primary) / 0.3)`
- **Connection Lines**: `hsl(var(--primary))` at 40% opacity
- **City Markers**: 
  - Core: `hsl(var(--background))`
  - Ring: `hsl(var(--primary))`
  - Pulse: `hsl(var(--primary))` at 30% opacity

### Background
```css
background: linear-gradient(to bottom right, 
  hsl(var(--background)), 
  hsl(var(--background)), 
  hsl(var(--primary) / 0.05)
)
```

### Typography
- **Title**: 2xl/4xl font-bold with gradient text effect
- **Subtitle**: xs/base text-muted-foreground
- **Stats**: lg/2xl font-bold text-primary

## User Flow

### Level 1: World View
**State**: `{ level: "world" }`

**Features**:
- Display world map with all countries
- Show 5 major cities with markers (New York, London, Tokyo, Sydney, Dubai)
- Animated connection lines between cities
- Stats overlay showing global metrics

**Interaction**: Click on USA → Navigate to Level 2

**Map Configuration**:
```javascript
{
  projection: "geoMercator",
  scale: 147,
  center: [0, 20]
}
```

### Level 2: USA View
**State**: `{ level: "usa", selectedCountry: "United States of America" }`

**Features**:
- Display all US states
- Back button to return to world view
- Title changes to "United States"
- Instruction text: "Click on a state to zoom in"

**Interaction**: Click on any state → Navigate to Level 3

**Map Configuration**:
```javascript
{
  projection: "geoAlbersUsa",
  scale: 1000,
  center: [-96, 38]
}
```

### Level 3: State View
**State**: `{ level: "state", selectedCountry: "United States of America", selectedState: "StateName" }`

**Features**:
- Display only the selected state
- Back button to return to USA view
- Title shows state name
- Detailed state view with higher zoom level

**Interaction**: Click Back → Return to Level 2

**Map Configuration**:
```javascript
{
  projection: "geoAlbersUsa",
  scale: 3000,
  center: [-96, 38]
}
```

## Component Structure

### State Management
```typescript
interface ViewState {
  level: ViewLevel; // "world" | "usa" | "state"
  selectedCountry?: string;
  selectedState?: string;
}
```

### Key Components

#### ComposableMap
Main container for the map visualization
- Dynamic projection based on view level
- Responsive sizing with max-width constraint

#### Geographies
Renders geographic regions from TopoJSON data
- Filtered based on current view level
- Click handlers for navigation
- Hover effects for interactivity

#### Marker
City markers (world view only)
- Dual-circle design with pulse animation
- Positioned using geographic coordinates

#### Line
Connection lines between cities (world view only)
- Curved geodesic paths
- Pulse animation for visual interest

### UI Overlays

#### Title Overlay
- Position: `top-4 left-4` (mobile) / `top-8 left-8` (desktop)
- Dynamic content based on view level
- Gradient text effect on title

#### Stats Overlay
- Position: `bottom-4` / `bottom-8`
- 4 stat cards with hover effects
- Responsive flex layout
- Glass morphism effect (`backdrop-blur-md`)

#### Back Button
- Position: `top-4 right-4` / `top-8 right-8`
- Only visible on USA and State views
- Chevron icon from lucide-react

## Responsive Design

### Breakpoints
- **Mobile**: Base styles
- **Desktop**: `md:` prefix (≥768px)

### Responsive Properties
- Padding: `p-2` → `md:p-0`
- Text sizes: `text-2xl` → `md:text-4xl`
- Stat cards: `p-2` → `md:p-4`
- Gaps: `gap-2` → `md:gap-6`

## Animations

### CSS Classes
- `animate-pulse` - Pulsing effect on connection lines and city markers
- `transition-all duration-300` - Smooth hover transitions on stat cards
- `hover:scale-105` - Scale up effect on stat cards

### Map Interactions
- Geography hover opacity: 95% → 100%
- Transition timing: `0.2s ease-in-out`

## Performance Considerations

- Geographic data loaded via CDN
- Component uses React hooks for state management
- Conditional rendering for markers and connections (world view only)
- Geography filtering for state view reduces render overhead

## Future Enhancement Ideas

- Add zoom/pan controls
- Implement county-level drill down
- Add data visualization layer (choropleth, heat maps)
- Enable search functionality
- Add route planning between cities
- Implement WebGL rendering for larger datasets
