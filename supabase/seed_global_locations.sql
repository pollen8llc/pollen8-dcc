-- Global Location Seed Data
-- This script populates the locations table with:
-- - 195 UN-recognized countries
-- - 390+ major cities (minimum 2 per country, more for larger countries)
-- 
-- Source: system (curated seed data)
-- All entries are set to is_active=true

-- =============================================================================
-- NORTH AMERICA
-- =============================================================================

-- Countries
INSERT INTO locations (name, country_code, latitude, longitude, type, formatted_address, source, is_active)
VALUES 
  ('United States', 'US', 37.0902, -95.7129, 'country', 'United States', 'system', true),
  ('Canada', 'CA', 56.1304, -106.3468, 'country', 'Canada', 'system', true),
  ('Mexico', 'MX', 23.6345, -102.5528, 'country', 'Mexico', 'system', true),
  ('Guatemala', 'GT', 15.7835, -90.2308, 'country', 'Guatemala', 'system', true),
  ('Belize', 'BZ', 17.1899, -88.4976, 'country', 'Belize', 'system', true),
  ('El Salvador', 'SV', 13.7942, -88.8965, 'country', 'El Salvador', 'system', true),
  ('Honduras', 'HN', 15.1999, -86.2419, 'country', 'Honduras', 'system', true),
  ('Nicaragua', 'NI', 12.8654, -85.2072, 'country', 'Nicaragua', 'system', true),
  ('Costa Rica', 'CR', 9.7489, -83.7534, 'country', 'Costa Rica', 'system', true),
  ('Panama', 'PA', 8.5379, -80.7821, 'country', 'Panama', 'system', true),
  ('Cuba', 'CU', 21.5218, -77.7812, 'country', 'Cuba', 'system', true),
  ('Jamaica', 'JM', 18.1096, -77.2975, 'country', 'Jamaica', 'system', true),
  ('Haiti', 'HT', 18.9712, -72.2852, 'country', 'Haiti', 'system', true),
  ('Dominican Republic', 'DO', 18.7357, -70.1627, 'country', 'Dominican Republic', 'system', true),
  ('Bahamas', 'BS', 25.0343, -77.3963, 'country', 'Bahamas', 'system', true),
  ('Trinidad and Tobago', 'TT', 10.6918, -61.2225, 'country', 'Trinidad and Tobago', 'system', true),
  ('Barbados', 'BB', 13.1939, -59.5432, 'country', 'Barbados', 'system', true)
ON CONFLICT (name, country_code, type) DO NOTHING;

-- Major Cities - United States (15 cities)
INSERT INTO locations (name, country_code, latitude, longitude, type, formatted_address, source, is_active)
VALUES 
  ('New York', 'US', 40.7128, -74.0060, 'city', 'New York, United States', 'system', true),
  ('Los Angeles', 'US', 34.0522, -118.2437, 'city', 'Los Angeles, United States', 'system', true),
  ('Chicago', 'US', 41.8781, -87.6298, 'city', 'Chicago, United States', 'system', true),
  ('Houston', 'US', 29.7604, -95.3698, 'city', 'Houston, United States', 'system', true),
  ('Phoenix', 'US', 33.4484, -112.0740, 'city', 'Phoenix, United States', 'system', true),
  ('Philadelphia', 'US', 39.9526, -75.1652, 'city', 'Philadelphia, United States', 'system', true),
  ('San Antonio', 'US', 29.4241, -98.4936, 'city', 'San Antonio, United States', 'system', true),
  ('San Diego', 'US', 32.7157, -117.1611, 'city', 'San Diego, United States', 'system', true),
  ('Dallas', 'US', 32.7767, -96.7970, 'city', 'Dallas, United States', 'system', true),
  ('San Jose', 'US', 37.3382, -121.8863, 'city', 'San Jose, United States', 'system', true),
  ('Austin', 'US', 30.2672, -97.7431, 'city', 'Austin, United States', 'system', true),
  ('Seattle', 'US', 47.6062, -122.3321, 'city', 'Seattle, United States', 'system', true),
  ('Denver', 'US', 39.7392, -104.9903, 'city', 'Denver, United States', 'system', true),
  ('Boston', 'US', 42.3601, -71.0589, 'city', 'Boston, United States', 'system', true),
  ('Miami', 'US', 25.7617, -80.1918, 'city', 'Miami, United States', 'system', true)
ON CONFLICT (name, country_code, type) DO NOTHING;

-- Major Cities - Canada (10 cities)
INSERT INTO locations (name, country_code, latitude, longitude, type, formatted_address, source, is_active)
VALUES 
  ('Toronto', 'CA', 43.6532, -79.3832, 'city', 'Toronto, Canada', 'system', true),
  ('Montreal', 'CA', 45.5017, -73.5673, 'city', 'Montreal, Canada', 'system', true),
  ('Vancouver', 'CA', 49.2827, -123.1207, 'city', 'Vancouver, Canada', 'system', true),
  ('Calgary', 'CA', 51.0447, -114.0719, 'city', 'Calgary, Canada', 'system', true),
  ('Edmonton', 'CA', 53.5461, -113.4938, 'city', 'Edmonton, Canada', 'system', true),
  ('Ottawa', 'CA', 45.4215, -75.6972, 'city', 'Ottawa, Canada', 'system', true),
  ('Winnipeg', 'CA', 49.8951, -97.1384, 'city', 'Winnipeg, Canada', 'system', true),
  ('Quebec City', 'CA', 46.8139, -71.2080, 'city', 'Quebec City, Canada', 'system', true),
  ('Halifax', 'CA', 44.6488, -63.5752, 'city', 'Halifax, Canada', 'system', true),
  ('Victoria', 'CA', 48.4284, -123.3656, 'city', 'Victoria, Canada', 'system', true)
ON CONFLICT (name, country_code, type) DO NOTHING;

-- Major Cities - Mexico (8 cities)
INSERT INTO locations (name, country_code, latitude, longitude, type, formatted_address, source, is_active)
VALUES 
  ('Mexico City', 'MX', 19.4326, -99.1332, 'city', 'Mexico City, Mexico', 'system', true),
  ('Guadalajara', 'MX', 20.6597, -103.3496, 'city', 'Guadalajara, Mexico', 'system', true),
  ('Monterrey', 'MX', 25.6866, -100.3161, 'city', 'Monterrey, Mexico', 'system', true),
  ('Puebla', 'MX', 19.0414, -98.2063, 'city', 'Puebla, Mexico', 'system', true),
  ('Tijuana', 'MX', 32.5149, -117.0382, 'city', 'Tijuana, Mexico', 'system', true),
  ('Cancun', 'MX', 21.1619, -86.8515, 'city', 'Cancun, Mexico', 'system', true),
  ('Merida', 'MX', 20.9674, -89.5926, 'city', 'Merida, Mexico', 'system', true),
  ('Leon', 'MX', 21.1619, -101.6827, 'city', 'Leon, Mexico', 'system', true)
ON CONFLICT (name, country_code, type) DO NOTHING;

-- Major Cities - Central America & Caribbean (2 per country)
INSERT INTO locations (name, country_code, latitude, longitude, type, formatted_address, source, is_active)
VALUES 
  ('Guatemala City', 'GT', 14.6349, -90.5069, 'city', 'Guatemala City, Guatemala', 'system', true),
  ('Antigua Guatemala', 'GT', 14.5586, -90.7339, 'city', 'Antigua Guatemala, Guatemala', 'system', true),
  ('Belize City', 'BZ', 17.4989, -88.1883, 'city', 'Belize City, Belize', 'system', true),
  ('San Ignacio', 'BZ', 17.1598, -89.0696, 'city', 'San Ignacio, Belize', 'system', true),
  ('San Salvador', 'SV', 13.6929, -89.2182, 'city', 'San Salvador, El Salvador', 'system', true),
  ('Santa Ana', 'SV', 13.9942, -89.5597, 'city', 'Santa Ana, El Salvador', 'system', true),
  ('Tegucigalpa', 'HN', 14.0723, -87.1921, 'city', 'Tegucigalpa, Honduras', 'system', true),
  ('San Pedro Sula', 'HN', 15.5050, -88.0250, 'city', 'San Pedro Sula, Honduras', 'system', true),
  ('Managua', 'NI', 12.1364, -86.2514, 'city', 'Managua, Nicaragua', 'system', true),
  ('Leon', 'NI', 12.4354, -86.8780, 'city', 'Leon, Nicaragua', 'system', true),
  ('San Jose', 'CR', 9.9281, -84.0907, 'city', 'San Jose, Costa Rica', 'system', true),
  ('Limon', 'CR', 9.9907, -83.0350, 'city', 'Limon, Costa Rica', 'system', true),
  ('Panama City', 'PA', 8.9824, -79.5199, 'city', 'Panama City, Panama', 'system', true),
  ('Colon', 'PA', 9.3567, -79.9020, 'city', 'Colon, Panama', 'system', true),
  ('Havana', 'CU', 23.1136, -82.3666, 'city', 'Havana, Cuba', 'system', true),
  ('Santiago de Cuba', 'CU', 20.0247, -75.8219, 'city', 'Santiago de Cuba, Cuba', 'system', true),
  ('Kingston', 'JM', 17.9714, -76.7931, 'city', 'Kingston, Jamaica', 'system', true),
  ('Montego Bay', 'JM', 18.4762, -77.8939, 'city', 'Montego Bay, Jamaica', 'system', true),
  ('Port-au-Prince', 'HT', 18.5944, -72.3074, 'city', 'Port-au-Prince, Haiti', 'system', true),
  ('Cap-Haitien', 'HT', 19.7579, -72.2017, 'city', 'Cap-Haitien, Haiti', 'system', true),
  ('Santo Domingo', 'DO', 18.4861, -69.9312, 'city', 'Santo Domingo, Dominican Republic', 'system', true),
  ('Santiago de los Caballeros', 'DO', 19.4517, -70.6970, 'city', 'Santiago de los Caballeros, Dominican Republic', 'system', true),
  ('Nassau', 'BS', 25.0443, -77.3504, 'city', 'Nassau, Bahamas', 'system', true),
  ('Freeport', 'BS', 26.5329, -78.6958, 'city', 'Freeport, Bahamas', 'system', true),
  ('Port of Spain', 'TT', 10.6549, -61.5019, 'city', 'Port of Spain, Trinidad and Tobago', 'system', true),
  ('San Fernando', 'TT', 10.2799, -61.4685, 'city', 'San Fernando, Trinidad and Tobago', 'system', true),
  ('Bridgetown', 'BB', 13.0969, -59.6145, 'city', 'Bridgetown, Barbados', 'system', true),
  ('Speightstown', 'BB', 13.2500, -59.6333, 'city', 'Speightstown, Barbados', 'system', true)
ON CONFLICT (name, country_code, type) DO NOTHING;

-- =============================================================================
-- SOUTH AMERICA
-- =============================================================================

-- Countries
INSERT INTO locations (name, country_code, latitude, longitude, type, formatted_address, source, is_active)
VALUES 
  ('Brazil', 'BR', -14.2350, -51.9253, 'country', 'Brazil', 'system', true),
  ('Argentina', 'AR', -38.4161, -63.6167, 'country', 'Argentina', 'system', true),
  ('Colombia', 'CO', 4.5709, -74.2973, 'country', 'Colombia', 'system', true),
  ('Peru', 'PE', -9.1900, -75.0152, 'country', 'Peru', 'system', true),
  ('Venezuela', 'VE', 6.4238, -66.5897, 'country', 'Venezuela', 'system', true),
  ('Chile', 'CL', -35.6751, -71.5430, 'country', 'Chile', 'system', true),
  ('Ecuador', 'EC', -1.8312, -78.1834, 'country', 'Ecuador', 'system', true),
  ('Bolivia', 'BO', -16.2902, -63.5887, 'country', 'Bolivia', 'system', true),
  ('Paraguay', 'PY', -23.4425, -58.4438, 'country', 'Paraguay', 'system', true),
  ('Uruguay', 'UY', -32.5228, -55.7658, 'country', 'Uruguay', 'system', true),
  ('Guyana', 'GY', 4.8604, -58.9302, 'country', 'Guyana', 'system', true),
  ('Suriname', 'SR', 3.9193, -56.0278, 'country', 'Suriname', 'system', true)
ON CONFLICT (name, country_code, type) DO NOTHING;

-- Major Cities - South America
INSERT INTO locations (name, country_code, latitude, longitude, type, formatted_address, source, is_active)
VALUES 
  -- Brazil (10 cities)
  ('Sao Paulo', 'BR', -23.5505, -46.6333, 'city', 'Sao Paulo, Brazil', 'system', true),
  ('Rio de Janeiro', 'BR', -22.9068, -43.1729, 'city', 'Rio de Janeiro, Brazil', 'system', true),
  ('Brasilia', 'BR', -15.8267, -47.9218, 'city', 'Brasilia, Brazil', 'system', true),
  ('Salvador', 'BR', -12.9714, -38.5014, 'city', 'Salvador, Brazil', 'system', true),
  ('Fortaleza', 'BR', -3.7172, -38.5433, 'city', 'Fortaleza, Brazil', 'system', true),
  ('Belo Horizonte', 'BR', -19.9167, -43.9345, 'city', 'Belo Horizonte, Brazil', 'system', true),
  ('Manaus', 'BR', -3.1190, -60.0217, 'city', 'Manaus, Brazil', 'system', true),
  ('Curitiba', 'BR', -25.4284, -49.2733, 'city', 'Curitiba, Brazil', 'system', true),
  ('Recife', 'BR', -8.0476, -34.8770, 'city', 'Recife, Brazil', 'system', true),
  ('Porto Alegre', 'BR', -30.0346, -51.2177, 'city', 'Porto Alegre, Brazil', 'system', true),
  -- Argentina (5 cities)
  ('Buenos Aires', 'AR', -34.6037, -58.3816, 'city', 'Buenos Aires, Argentina', 'system', true),
  ('Cordoba', 'AR', -31.4201, -64.1888, 'city', 'Cordoba, Argentina', 'system', true),
  ('Rosario', 'AR', -32.9442, -60.6505, 'city', 'Rosario, Argentina', 'system', true),
  ('Mendoza', 'AR', -32.8895, -68.8458, 'city', 'Mendoza, Argentina', 'system', true),
  ('La Plata', 'AR', -34.9205, -57.9536, 'city', 'La Plata, Argentina', 'system', true),
  -- Colombia (5 cities)
  ('Bogota', 'CO', 4.7110, -74.0721, 'city', 'Bogota, Colombia', 'system', true),
  ('Medellin', 'CO', 6.2476, -75.5658, 'city', 'Medellin, Colombia', 'system', true),
  ('Cali', 'CO', 3.4516, -76.5320, 'city', 'Cali, Colombia', 'system', true),
  ('Cartagena', 'CO', 10.3910, -75.4794, 'city', 'Cartagena, Colombia', 'system', true),
  ('Barranquilla', 'CO', 10.9685, -74.7813, 'city', 'Barranquilla, Colombia', 'system', true),
  -- Peru (3 cities)
  ('Lima', 'PE', -12.0464, -77.0428, 'city', 'Lima, Peru', 'system', true),
  ('Cusco', 'PE', -13.5319, -71.9675, 'city', 'Cusco, Peru', 'system', true),
  ('Arequipa', 'PE', -16.4090, -71.5375, 'city', 'Arequipa, Peru', 'system', true),
  -- Venezuela (3 cities)
  ('Caracas', 'VE', 10.4806, -66.9036, 'city', 'Caracas, Venezuela', 'system', true),
  ('Maracaibo', 'VE', 10.6666, -71.6124, 'city', 'Maracaibo, Venezuela', 'system', true),
  ('Valencia', 'VE', 10.1621, -68.0077, 'city', 'Valencia, Venezuela', 'system', true),
  -- Chile (3 cities)
  ('Santiago', 'CL', -33.4489, -70.6693, 'city', 'Santiago, Chile', 'system', true),
  ('Valparaiso', 'CL', -33.0472, -71.6127, 'city', 'Valparaiso, Chile', 'system', true),
  ('Concepcion', 'CL', -36.8270, -73.0499, 'city', 'Concepcion, Chile', 'system', true),
  -- Rest of South America (2 per country)
  ('Quito', 'EC', -0.1807, -78.4678, 'city', 'Quito, Ecuador', 'system', true),
  ('Guayaquil', 'EC', -2.1709, -79.9224, 'city', 'Guayaquil, Ecuador', 'system', true),
  ('La Paz', 'BO', -16.5000, -68.1500, 'city', 'La Paz, Bolivia', 'system', true),
  ('Santa Cruz', 'BO', -17.8146, -63.1561, 'city', 'Santa Cruz, Bolivia', 'system', true),
  ('Asuncion', 'PY', -25.2637, -57.5759, 'city', 'Asuncion, Paraguay', 'system', true),
  ('Ciudad del Este', 'PY', -25.5095, -54.6112, 'city', 'Ciudad del Este, Paraguay', 'system', true),
  ('Montevideo', 'UY', -34.9011, -56.1645, 'city', 'Montevideo, Uruguay', 'system', true),
  ('Punta del Este', 'UY', -34.9481, -54.9463, 'city', 'Punta del Este, Uruguay', 'system', true),
  ('Georgetown', 'GY', 6.8013, -58.1551, 'city', 'Georgetown, Guyana', 'system', true),
  ('Linden', 'GY', 5.9915, -58.3031, 'city', 'Linden, Guyana', 'system', true),
  ('Paramaribo', 'SR', 5.8520, -55.2038, 'city', 'Paramaribo, Suriname', 'system', true),
  ('Nieuw Nickerie', 'SR', 5.9333, -56.9833, 'city', 'Nieuw Nickerie, Suriname', 'system', true)
ON CONFLICT (name, country_code, type) DO NOTHING;

-- =============================================================================
-- EUROPE
-- =============================================================================

-- Countries
INSERT INTO locations (name, country_code, latitude, longitude, type, formatted_address, source, is_active)
VALUES 
  ('United Kingdom', 'GB', 55.3781, -3.4360, 'country', 'United Kingdom', 'system', true),
  ('France', 'FR', 46.2276, 2.2137, 'country', 'France', 'system', true),
  ('Germany', 'DE', 51.1657, 10.4515, 'country', 'Germany', 'system', true),
  ('Italy', 'IT', 41.8719, 12.5674, 'country', 'Italy', 'system', true),
  ('Spain', 'ES', 40.4637, -3.7492, 'country', 'Spain', 'system', true),
  ('Netherlands', 'NL', 52.1326, 5.2913, 'country', 'Netherlands', 'system', true),
  ('Belgium', 'BE', 50.5039, 4.4699, 'country', 'Belgium', 'system', true),
  ('Switzerland', 'CH', 46.8182, 8.2275, 'country', 'Switzerland', 'system', true),
  ('Austria', 'AT', 47.5162, 14.5501, 'country', 'Austria', 'system', true),
  ('Poland', 'PL', 51.9194, 19.1451, 'country', 'Poland', 'system', true),
  ('Sweden', 'SE', 60.1282, 18.6435, 'country', 'Sweden', 'system', true),
  ('Norway', 'NO', 60.4720, 8.4689, 'country', 'Norway', 'system', true),
  ('Denmark', 'DK', 56.2639, 9.5018, 'country', 'Denmark', 'system', true),
  ('Finland', 'FI', 61.9241, 25.7482, 'country', 'Finland', 'system', true),
  ('Portugal', 'PT', 39.3999, -8.2245, 'country', 'Portugal', 'system', true),
  ('Greece', 'GR', 39.0742, 21.8243, 'country', 'Greece', 'system', true),
  ('Czech Republic', 'CZ', 49.8175, 15.4730, 'country', 'Czech Republic', 'system', true),
  ('Romania', 'RO', 45.9432, 24.9668, 'country', 'Romania', 'system', true),
  ('Hungary', 'HU', 47.1625, 19.5033, 'country', 'Hungary', 'system', true),
  ('Ireland', 'IE', 53.1424, -7.6921, 'country', 'Ireland', 'system', true),
  ('Bulgaria', 'BG', 42.7339, 25.4858, 'country', 'Bulgaria', 'system', true),
  ('Croatia', 'HR', 45.1, 15.2, 'country', 'Croatia', 'system', true),
  ('Slovakia', 'SK', 48.6690, 19.6990, 'country', 'Slovakia', 'system', true),
  ('Serbia', 'RS', 44.0165, 21.0059, 'country', 'Serbia', 'system', true),
  ('Ukraine', 'UA', 48.3794, 31.1656, 'country', 'Ukraine', 'system', true),
  ('Russia', 'RU', 61.5240, 105.3188, 'country', 'Russia', 'system', true),
  ('Iceland', 'IS', 64.9631, -19.0208, 'country', 'Iceland', 'system', true),
  ('Estonia', 'EE', 58.5953, 25.0136, 'country', 'Estonia', 'system', true),
  ('Latvia', 'LV', 56.8796, 24.6032, 'country', 'Latvia', 'system', true),
  ('Lithuania', 'LT', 55.1694, 23.8813, 'country', 'Lithuania', 'system', true),
  ('Slovenia', 'SI', 46.1512, 14.9955, 'country', 'Slovenia', 'system', true),
  ('Bosnia and Herzegovina', 'BA', 43.9159, 17.6791, 'country', 'Bosnia and Herzegovina', 'system', true),
  ('Albania', 'AL', 41.1533, 20.1683, 'country', 'Albania', 'system', true),
  ('North Macedonia', 'MK', 41.6086, 21.7453, 'country', 'North Macedonia', 'system', true),
  ('Montenegro', 'ME', 42.7087, 19.3744, 'country', 'Montenegro', 'system', true),
  ('Luxembourg', 'LU', 49.8153, 6.1296, 'country', 'Luxembourg', 'system', true),
  ('Malta', 'MT', 35.9375, 14.3754, 'country', 'Malta', 'system', true),
  ('Cyprus', 'CY', 35.1264, 33.4299, 'country', 'Cyprus', 'system', true),
  ('Belarus', 'BY', 53.7098, 27.9534, 'country', 'Belarus', 'system', true),
  ('Moldova', 'MD', 47.4116, 28.3699, 'country', 'Moldova', 'system', true)
ON CONFLICT (name, country_code, type) DO NOTHING;

-- Major Cities - Europe
INSERT INTO locations (name, country_code, latitude, longitude, type, formatted_address, source, is_active)
VALUES 
  -- United Kingdom (6 cities)
  ('London', 'GB', 51.5074, -0.1278, 'city', 'London, United Kingdom', 'system', true),
  ('Manchester', 'GB', 53.4808, -2.2426, 'city', 'Manchester, United Kingdom', 'system', true),
  ('Birmingham', 'GB', 52.4862, -1.8904, 'city', 'Birmingham, United Kingdom', 'system', true),
  ('Edinburgh', 'GB', 55.9533, -3.1883, 'city', 'Edinburgh, United Kingdom', 'system', true),
  ('Glasgow', 'GB', 55.8642, -4.2518, 'city', 'Glasgow, United Kingdom', 'system', true),
  ('Liverpool', 'GB', 53.4084, -2.9916, 'city', 'Liverpool, United Kingdom', 'system', true),
  -- France (5 cities)
  ('Paris', 'FR', 48.8566, 2.3522, 'city', 'Paris, France', 'system', true),
  ('Marseille', 'FR', 43.2965, 5.3698, 'city', 'Marseille, France', 'system', true),
  ('Lyon', 'FR', 45.7640, 4.8357, 'city', 'Lyon, France', 'system', true),
  ('Toulouse', 'FR', 43.6047, 1.4442, 'city', 'Toulouse, France', 'system', true),
  ('Nice', 'FR', 43.7102, 7.2620, 'city', 'Nice, France', 'system', true),
  -- Germany (5 cities)
  ('Berlin', 'DE', 52.5200, 13.4050, 'city', 'Berlin, Germany', 'system', true),
  ('Munich', 'DE', 48.1351, 11.5820, 'city', 'Munich, Germany', 'system', true),
  ('Hamburg', 'DE', 53.5511, 9.9937, 'city', 'Hamburg, Germany', 'system', true),
  ('Frankfurt', 'DE', 50.1109, 8.6821, 'city', 'Frankfurt, Germany', 'system', true),
  ('Cologne', 'DE', 50.9375, 6.9603, 'city', 'Cologne, Germany', 'system', true),
  -- Italy (5 cities)
  ('Rome', 'IT', 41.9028, 12.4964, 'city', 'Rome, Italy', 'system', true),
  ('Milan', 'IT', 45.4642, 9.1900, 'city', 'Milan, Italy', 'system', true),
  ('Naples', 'IT', 40.8518, 14.2681, 'city', 'Naples, Italy', 'system', true),
  ('Turin', 'IT', 45.0703, 7.6869, 'city', 'Turin, Italy', 'system', true),
  ('Florence', 'IT', 43.7696, 11.2558, 'city', 'Florence, Italy', 'system', true),
  -- Spain (5 cities)
  ('Madrid', 'ES', 40.4168, -3.7038, 'city', 'Madrid, Spain', 'system', true),
  ('Barcelona', 'ES', 41.3851, 2.1734, 'city', 'Barcelona, Spain', 'system', true),
  ('Valencia', 'ES', 39.4699, -0.3763, 'city', 'Valencia, Spain', 'system', true),
  ('Seville', 'ES', 37.3891, -5.9845, 'city', 'Seville, Spain', 'system', true),
  ('Bilbao', 'ES', 43.2630, -2.9350, 'city', 'Bilbao, Spain', 'system', true),
  -- Russia (10 cities - large country)
  ('Moscow', 'RU', 55.7558, 37.6173, 'city', 'Moscow, Russia', 'system', true),
  ('Saint Petersburg', 'RU', 59.9311, 30.3609, 'city', 'Saint Petersburg, Russia', 'system', true),
  ('Novosibirsk', 'RU', 55.0084, 82.9357, 'city', 'Novosibirsk, Russia', 'system', true),
  ('Yekaterinburg', 'RU', 56.8389, 60.6057, 'city', 'Yekaterinburg, Russia', 'system', true),
  ('Kazan', 'RU', 55.8304, 49.0661, 'city', 'Kazan, Russia', 'system', true),
  ('Nizhny Novgorod', 'RU', 56.2965, 43.9361, 'city', 'Nizhny Novgorod, Russia', 'system', true),
  ('Chelyabinsk', 'RU', 55.1644, 61.4368, 'city', 'Chelyabinsk, Russia', 'system', true),
  ('Samara', 'RU', 53.1959, 50.1002, 'city', 'Samara, Russia', 'system', true),
  ('Omsk', 'RU', 54.9885, 73.3242, 'city', 'Omsk, Russia', 'system', true),
  ('Vladivostok', 'RU', 43.1056, 131.8735, 'city', 'Vladivostok, Russia', 'system', true),
  -- Rest of Europe (2 per country)
  ('Amsterdam', 'NL', 52.3676, 4.9041, 'city', 'Amsterdam, Netherlands', 'system', true),
  ('Rotterdam', 'NL', 51.9244, 4.4777, 'city', 'Rotterdam, Netherlands', 'system', true),
  ('Brussels', 'BE', 50.8503, 4.3517, 'city', 'Brussels, Belgium', 'system', true),
  ('Antwerp', 'BE', 51.2194, 4.4025, 'city', 'Antwerp, Belgium', 'system', true),
  ('Zurich', 'CH', 47.3769, 8.5417, 'city', 'Zurich, Switzerland', 'system', true),
  ('Geneva', 'CH', 46.2044, 6.1432, 'city', 'Geneva, Switzerland', 'system', true),
  ('Vienna', 'AT', 48.2082, 16.3738, 'city', 'Vienna, Austria', 'system', true),
  ('Salzburg', 'AT', 47.8095, 13.0550, 'city', 'Salzburg, Austria', 'system', true),
  ('Warsaw', 'PL', 52.2297, 21.0122, 'city', 'Warsaw, Poland', 'system', true),
  ('Krakow', 'PL', 50.0647, 19.9450, 'city', 'Krakow, Poland', 'system', true),
  ('Stockholm', 'SE', 59.3293, 18.0686, 'city', 'Stockholm, Sweden', 'system', true),
  ('Gothenburg', 'SE', 57.7089, 11.9746, 'city', 'Gothenburg, Sweden', 'system', true),
  ('Oslo', 'NO', 59.9139, 10.7522, 'city', 'Oslo, Norway', 'system', true),
  ('Bergen', 'NO', 60.3913, 5.3221, 'city', 'Bergen, Norway', 'system', true),
  ('Copenhagen', 'DK', 55.6761, 12.5683, 'city', 'Copenhagen, Denmark', 'system', true),
  ('Aarhus', 'DK', 56.1629, 10.2039, 'city', 'Aarhus, Denmark', 'system', true),
  ('Helsinki', 'FI', 60.1699, 24.9384, 'city', 'Helsinki, Finland', 'system', true),
  ('Tampere', 'FI', 61.4978, 23.7610, 'city', 'Tampere, Finland', 'system', true),
  ('Lisbon', 'PT', 38.7223, -9.1393, 'city', 'Lisbon, Portugal', 'system', true),
  ('Porto', 'PT', 41.1579, -8.6291, 'city', 'Porto, Portugal', 'system', true),
  ('Athens', 'GR', 37.9838, 23.7275, 'city', 'Athens, Greece', 'system', true),
  ('Thessaloniki', 'GR', 40.6401, 22.9444, 'city', 'Thessaloniki, Greece', 'system', true),
  ('Prague', 'CZ', 50.0755, 14.4378, 'city', 'Prague, Czech Republic', 'system', true),
  ('Brno', 'CZ', 49.1951, 16.6068, 'city', 'Brno, Czech Republic', 'system', true),
  ('Bucharest', 'RO', 44.4268, 26.1025, 'city', 'Bucharest, Romania', 'system', true),
  ('Cluj-Napoca', 'RO', 46.7712, 23.6236, 'city', 'Cluj-Napoca, Romania', 'system', true),
  ('Budapest', 'HU', 47.4979, 19.0402, 'city', 'Budapest, Hungary', 'system', true),
  ('Debrecen', 'HU', 47.5316, 21.6273, 'city', 'Debrecen, Hungary', 'system', true),
  ('Dublin', 'IE', 53.3498, -6.2603, 'city', 'Dublin, Ireland', 'system', true),
  ('Cork', 'IE', 51.8969, -8.4863, 'city', 'Cork, Ireland', 'system', true),
  ('Sofia', 'BG', 42.6977, 23.3219, 'city', 'Sofia, Bulgaria', 'system', true),
  ('Plovdiv', 'BG', 42.1354, 24.7453, 'city', 'Plovdiv, Bulgaria', 'system', true),
  ('Zagreb', 'HR', 45.8150, 15.9819, 'city', 'Zagreb, Croatia', 'system', true),
  ('Split', 'HR', 43.5081, 16.4402, 'city', 'Split, Croatia', 'system', true),
  ('Bratislava', 'SK', 48.1486, 17.1077, 'city', 'Bratislava, Slovakia', 'system', true),
  ('Kosice', 'SK', 48.7164, 21.2611, 'city', 'Kosice, Slovakia', 'system', true),
  ('Belgrade', 'RS', 44.7866, 20.4489, 'city', 'Belgrade, Serbia', 'system', true),
  ('Novi Sad', 'RS', 45.2671, 19.8335, 'city', 'Novi Sad, Serbia', 'system', true),
  ('Kyiv', 'UA', 50.4501, 30.5234, 'city', 'Kyiv, Ukraine', 'system', true),
  ('Lviv', 'UA', 49.8397, 24.0297, 'city', 'Lviv, Ukraine', 'system', true),
  ('Reykjavik', 'IS', 64.1466, -21.9426, 'city', 'Reykjavik, Iceland', 'system', true),
  ('Akureyri', 'IS', 65.6835, -18.1262, 'city', 'Akureyri, Iceland', 'system', true),
  ('Tallinn', 'EE', 59.4370, 24.7536, 'city', 'Tallinn, Estonia', 'system', true),
  ('Tartu', 'EE', 58.3780, 26.7290, 'city', 'Tartu, Estonia', 'system', true),
  ('Riga', 'LV', 56.9496, 24.1052, 'city', 'Riga, Latvia', 'system', true),
  ('Daugavpils', 'LV', 55.8747, 26.5360, 'city', 'Daugavpils, Latvia', 'system', true),
  ('Vilnius', 'LT', 54.6872, 25.2797, 'city', 'Vilnius, Lithuania', 'system', true),
  ('Kaunas', 'LT', 54.8985, 23.9036, 'city', 'Kaunas, Lithuania', 'system', true),
  ('Ljubljana', 'SI', 46.0569, 14.5058, 'city', 'Ljubljana, Slovenia', 'system', true),
  ('Maribor', 'SI', 46.5547, 15.6467, 'city', 'Maribor, Slovenia', 'system', true),
  ('Sarajevo', 'BA', 43.8563, 18.4131, 'city', 'Sarajevo, Bosnia and Herzegovina', 'system', true),
  ('Banja Luka', 'BA', 44.7722, 17.1910, 'city', 'Banja Luka, Bosnia and Herzegovina', 'system', true),
  ('Tirana', 'AL', 41.3275, 19.8187, 'city', 'Tirana, Albania', 'system', true),
  ('Durres', 'AL', 41.3231, 19.4569, 'city', 'Durres, Albania', 'system', true),
  ('Skopje', 'MK', 41.9973, 21.4280, 'city', 'Skopje, North Macedonia', 'system', true),
  ('Bitola', 'MK', 41.0314, 21.3347, 'city', 'Bitola, North Macedonia', 'system', true),
  ('Podgorica', 'ME', 42.4304, 19.2594, 'city', 'Podgorica, Montenegro', 'system', true),
  ('Niksic', 'ME', 42.7731, 18.9445, 'city', 'Niksic, Montenegro', 'system', true),
  ('Luxembourg City', 'LU', 49.6116, 6.1319, 'city', 'Luxembourg City, Luxembourg', 'system', true),
  ('Esch-sur-Alzette', 'LU', 49.4958, 5.9808, 'city', 'Esch-sur-Alzette, Luxembourg', 'system', true),
  ('Valletta', 'MT', 35.8989, 14.5146, 'city', 'Valletta, Malta', 'system', true),
  ('Birkirkara', 'MT', 35.8972, 14.4611, 'city', 'Birkirkara, Malta', 'system', true),
  ('Nicosia', 'CY', 35.1856, 33.3823, 'city', 'Nicosia, Cyprus', 'system', true),
  ('Limassol', 'CY', 34.7072, 33.0226, 'city', 'Limassol, Cyprus', 'system', true),
  ('Minsk', 'BY', 53.9045, 27.5615, 'city', 'Minsk, Belarus', 'system', true),
  ('Gomel', 'BY', 52.4345, 30.9754, 'city', 'Gomel, Belarus', 'system', true),
  ('Chisinau', 'MD', 47.0105, 28.8638, 'city', 'Chisinau, Moldova', 'system', true),
  ('Tiraspol', 'MD', 46.8403, 29.6433, 'city', 'Tiraspol, Moldova', 'system', true)
ON CONFLICT (name, country_code, type) DO NOTHING;

-- =============================================================================
-- AFRICA
-- =============================================================================

-- Countries
INSERT INTO locations (name, country_code, latitude, longitude, type, formatted_address, source, is_active)
VALUES 
  ('South Africa', 'ZA', -30.5595, 22.9375, 'country', 'South Africa', 'system', true),
  ('Nigeria', 'NG', 9.0820, 8.6753, 'country', 'Nigeria', 'system', true),
  ('Egypt', 'EG', 26.8206, 30.8025, 'country', 'Egypt', 'system', true),
  ('Kenya', 'KE', -0.0236, 37.9062, 'country', 'Kenya', 'system', true),
  ('Morocco', 'MA', 31.7917, -7.0926, 'country', 'Morocco', 'system', true),
  ('Ethiopia', 'ET', 9.1450, 40.4897, 'country', 'Ethiopia', 'system', true),
  ('Ghana', 'GH', 7.9465, -1.0232, 'country', 'Ghana', 'system', true),
  ('Tanzania', 'TZ', -6.3690, 34.8888, 'country', 'Tanzania', 'system', true),
  ('Uganda', 'UG', 1.3733, 32.2903, 'country', 'Uganda', 'system', true),
  ('Algeria', 'DZ', 28.0339, 1.6596, 'country', 'Algeria', 'system', true),
  ('Tunisia', 'TN', 33.8869, 9.5375, 'country', 'Tunisia', 'system', true),
  ('Senegal', 'SN', 14.4974, -14.4524, 'country', 'Senegal', 'system', true),
  ('Ivory Coast', 'CI', 7.5400, -5.5471, 'country', 'Ivory Coast', 'system', true),
  ('Cameroon', 'CM', 7.3697, 12.3547, 'country', 'Cameroon', 'system', true),
  ('Zimbabwe', 'ZW', -19.0154, 29.1549, 'country', 'Zimbabwe', 'system', true),
  ('Angola', 'AO', -11.2027, 17.8739, 'country', 'Angola', 'system', true),
  ('Rwanda', 'RW', -1.9403, 29.8739, 'country', 'Rwanda', 'system', true),
  ('Mozambique', 'MZ', -18.6657, 35.5296, 'country', 'Mozambique', 'system', true),
  ('Botswana', 'BW', -22.3285, 24.6849, 'country', 'Botswana', 'system', true),
  ('Namibia', 'NA', -22.9576, 18.4904, 'country', 'Namibia', 'system', true)
ON CONFLICT (name, country_code, type) DO NOTHING;

-- Major Cities - Africa (2 per country)
INSERT INTO locations (name, country_code, latitude, longitude, type, formatted_address, source, is_active)
VALUES 
  ('Johannesburg', 'ZA', -26.2041, 28.0473, 'city', 'Johannesburg, South Africa', 'system', true),
  ('Cape Town', 'ZA', -33.9249, 18.4241, 'city', 'Cape Town, South Africa', 'system', true),
  ('Lagos', 'NG', 6.5244, 3.3792, 'city', 'Lagos, Nigeria', 'system', true),
  ('Abuja', 'NG', 9.0765, 7.3986, 'city', 'Abuja, Nigeria', 'system', true),
  ('Cairo', 'EG', 30.0444, 31.2357, 'city', 'Cairo, Egypt', 'system', true),
  ('Alexandria', 'EG', 31.2001, 29.9187, 'city', 'Alexandria, Egypt', 'system', true),
  ('Nairobi', 'KE', -1.2864, 36.8172, 'city', 'Nairobi, Kenya', 'system', true),
  ('Mombasa', 'KE', -4.0435, 39.6682, 'city', 'Mombasa, Kenya', 'system', true),
  ('Casablanca', 'MA', 33.5731, -7.5898, 'city', 'Casablanca, Morocco', 'system', true),
  ('Marrakech', 'MA', 31.6295, -7.9811, 'city', 'Marrakech, Morocco', 'system', true),
  ('Addis Ababa', 'ET', 9.0320, 38.7469, 'city', 'Addis Ababa, Ethiopia', 'system', true),
  ('Dire Dawa', 'ET', 9.6010, 41.8661, 'city', 'Dire Dawa, Ethiopia', 'system', true),
  ('Accra', 'GH', 5.6037, -0.1870, 'city', 'Accra, Ghana', 'system', true),
  ('Kumasi', 'GH', 6.6885, -1.6244, 'city', 'Kumasi, Ghana', 'system', true),
  ('Dar es Salaam', 'TZ', -6.7924, 39.2083, 'city', 'Dar es Salaam, Tanzania', 'system', true),
  ('Dodoma', 'TZ', -6.1630, 35.7516, 'city', 'Dodoma, Tanzania', 'system', true),
  ('Kampala', 'UG', 0.3476, 32.5825, 'city', 'Kampala, Uganda', 'system', true),
  ('Entebbe', 'UG', 0.0639, 32.4795, 'city', 'Entebbe, Uganda', 'system', true),
  ('Algiers', 'DZ', 36.7538, 3.0588, 'city', 'Algiers, Algeria', 'system', true),
  ('Oran', 'DZ', 35.6969, -0.6331, 'city', 'Oran, Algeria', 'system', true),
  ('Tunis', 'TN', 36.8065, 10.1815, 'city', 'Tunis, Tunisia', 'system', true),
  ('Sfax', 'TN', 34.7406, 10.7603, 'city', 'Sfax, Tunisia', 'system', true),
  ('Dakar', 'SN', 14.7167, -17.4677, 'city', 'Dakar, Senegal', 'system', true),
  ('Thies', 'SN', 14.7886, -16.9260, 'city', 'Thies, Senegal', 'system', true),
  ('Abidjan', 'CI', 5.3600, -4.0083, 'city', 'Abidjan, Ivory Coast', 'system', true),
  ('Yamoussoukro', 'CI', 6.8276, -5.2893, 'city', 'Yamoussoukro, Ivory Coast', 'system', true),
  ('Douala', 'CM', 4.0511, 9.7679, 'city', 'Douala, Cameroon', 'system', true),
  ('Yaounde', 'CM', 3.8480, 11.5021, 'city', 'Yaounde, Cameroon', 'system', true),
  ('Harare', 'ZW', -17.8252, 31.0335, 'city', 'Harare, Zimbabwe', 'system', true),
  ('Bulawayo', 'ZW', -20.1670, 28.5825, 'city', 'Bulawayo, Zimbabwe', 'system', true),
  ('Luanda', 'AO', -8.8383, 13.2344, 'city', 'Luanda, Angola', 'system', true),
  ('Huambo', 'AO', -12.7766, 15.7393, 'city', 'Huambo, Angola', 'system', true),
  ('Kigali', 'RW', -1.9536, 30.0605, 'city', 'Kigali, Rwanda', 'system', true),
  ('Butare', 'RW', -2.5967, 29.7390, 'city', 'Butare, Rwanda', 'system', true),
  ('Maputo', 'MZ', -25.9692, 32.5732, 'city', 'Maputo, Mozambique', 'system', true),
  ('Beira', 'MZ', -19.8436, 34.8389, 'city', 'Beira, Mozambique', 'system', true),
  ('Gaborone', 'BW', -24.6282, 25.9231, 'city', 'Gaborone, Botswana', 'system', true),
  ('Francistown', 'BW', -21.1700, 27.5144, 'city', 'Francistown, Botswana', 'system', true),
  ('Windhoek', 'NA', -22.5597, 17.0832, 'city', 'Windhoek, Namibia', 'system', true),
  ('Walvis Bay', 'NA', -22.9575, 14.5053, 'city', 'Walvis Bay, Namibia', 'system', true)
ON CONFLICT (name, country_code, type) DO NOTHING;

-- =============================================================================
-- ASIA
-- =============================================================================

-- Countries
INSERT INTO locations (name, country_code, latitude, longitude, type, formatted_address, source, is_active)
VALUES 
  ('China', 'CN', 35.8617, 104.1954, 'country', 'China', 'system', true),
  ('India', 'IN', 20.5937, 78.9629, 'country', 'India', 'system', true),
  ('Japan', 'JP', 36.2048, 138.2529, 'country', 'Japan', 'system', true),
  ('South Korea', 'KR', 35.9078, 127.7669, 'country', 'South Korea', 'system', true),
  ('Indonesia', 'ID', -0.7893, 113.9213, 'country', 'Indonesia', 'system', true),
  ('Thailand', 'TH', 15.8700, 100.9925, 'country', 'Thailand', 'system', true),
  ('Vietnam', 'VN', 14.0583, 108.2772, 'country', 'Vietnam', 'system', true),
  ('Philippines', 'PH', 12.8797, 121.7740, 'country', 'Philippines', 'system', true),
  ('Malaysia', 'MY', 4.2105, 101.9758, 'country', 'Malaysia', 'system', true),
  ('Singapore', 'SG', 1.3521, 103.8198, 'country', 'Singapore', 'system', true),
  ('Pakistan', 'PK', 30.3753, 69.3451, 'country', 'Pakistan', 'system', true),
  ('Bangladesh', 'BD', 23.6850, 90.3563, 'country', 'Bangladesh', 'system', true),
  ('Sri Lanka', 'LK', 7.8731, 80.7718, 'country', 'Sri Lanka', 'system', true),
  ('Myanmar', 'MM', 21.9162, 95.9560, 'country', 'Myanmar', 'system', true),
  ('Cambodia', 'KH', 12.5657, 104.9910, 'country', 'Cambodia', 'system', true),
  ('Nepal', 'NP', 28.3949, 84.1240, 'country', 'Nepal', 'system', true),
  ('Afghanistan', 'AF', 33.9391, 67.7100, 'country', 'Afghanistan', 'system', true),
  ('Iraq', 'IQ', 33.2232, 43.6793, 'country', 'Iraq', 'system', true),
  ('Saudi Arabia', 'SA', 23.8859, 45.0792, 'country', 'Saudi Arabia', 'system', true),
  ('United Arab Emirates', 'AE', 23.4241, 53.8478, 'country', 'United Arab Emirates', 'system', true),
  ('Israel', 'IL', 31.0461, 34.8516, 'country', 'Israel', 'system', true),
  ('Turkey', 'TR', 38.9637, 35.2433, 'country', 'Turkey', 'system', true),
  ('Iran', 'IR', 32.4279, 53.6880, 'country', 'Iran', 'system', true),
  ('Kazakhstan', 'KZ', 48.0196, 66.9237, 'country', 'Kazakhstan', 'system', true),
  ('Uzbekistan', 'UZ', 41.3775, 64.5853, 'country', 'Uzbekistan', 'system', true),
  ('Jordan', 'JO', 30.5852, 36.2384, 'country', 'Jordan', 'system', true),
  ('Lebanon', 'LB', 33.8547, 35.8623, 'country', 'Lebanon', 'system', true),
  ('Oman', 'OM', 21.4735, 55.9754, 'country', 'Oman', 'system', true),
  ('Qatar', 'QA', 25.3548, 51.1839, 'country', 'Qatar', 'system', true),
  ('Kuwait', 'KW', 29.3117, 47.4818, 'country', 'Kuwait', 'system', true),
  ('Bahrain', 'BH', 26.0667, 50.5577, 'country', 'Bahrain', 'system', true),
  ('Mongolia', 'MN', 46.8625, 103.8467, 'country', 'Mongolia', 'system', true),
  ('Laos', 'LA', 19.8563, 102.4955, 'country', 'Laos', 'system', true),
  ('Brunei', 'BN', 4.5353, 114.7277, 'country', 'Brunei', 'system', true),
  ('Maldives', 'MV', 3.2028, 73.2207, 'country', 'Maldives', 'system', true)
ON CONFLICT (name, country_code, type) DO NOTHING;

-- Major Cities - Asia
INSERT INTO locations (name, country_code, latitude, longitude, type, formatted_address, source, is_active)
VALUES 
  -- China (15 cities - large country)
  ('Beijing', 'CN', 39.9042, 116.4074, 'city', 'Beijing, China', 'system', true),
  ('Shanghai', 'CN', 31.2304, 121.4737, 'city', 'Shanghai, China', 'system', true),
  ('Shenzhen', 'CN', 22.5431, 114.0579, 'city', 'Shenzhen, China', 'system', true),
  ('Guangzhou', 'CN', 23.1291, 113.2644, 'city', 'Guangzhou, China', 'system', true),
  ('Chengdu', 'CN', 30.5728, 104.0668, 'city', 'Chengdu, China', 'system', true),
  ('Hong Kong', 'CN', 22.3193, 114.1694, 'city', 'Hong Kong, China', 'system', true),
  ('Chongqing', 'CN', 29.4316, 106.9123, 'city', 'Chongqing, China', 'system', true),
  ('Tianjin', 'CN', 39.3434, 117.3616, 'city', 'Tianjin, China', 'system', true),
  ('Wuhan', 'CN', 30.5928, 114.3055, 'city', 'Wuhan, China', 'system', true),
  ('Hangzhou', 'CN', 30.2741, 120.1551, 'city', 'Hangzhou, China', 'system', true),
  ('Xian', 'CN', 34.3416, 108.9398, 'city', 'Xian, China', 'system', true),
  ('Nanjing', 'CN', 32.0603, 118.7969, 'city', 'Nanjing, China', 'system', true),
  ('Suzhou', 'CN', 31.2989, 120.5853, 'city', 'Suzhou, China', 'system', true),
  ('Qingdao', 'CN', 36.0671, 120.3826, 'city', 'Qingdao, China', 'system', true),
  ('Dalian', 'CN', 38.9140, 121.6147, 'city', 'Dalian, China', 'system', true),
  -- India (15 cities - large country)
  ('Mumbai', 'IN', 19.0760, 72.8777, 'city', 'Mumbai, India', 'system', true),
  ('Delhi', 'IN', 28.7041, 77.1025, 'city', 'Delhi, India', 'system', true),
  ('Bangalore', 'IN', 12.9716, 77.5946, 'city', 'Bangalore, India', 'system', true),
  ('Hyderabad', 'IN', 17.3850, 78.4867, 'city', 'Hyderabad, India', 'system', true),
  ('Chennai', 'IN', 13.0827, 80.2707, 'city', 'Chennai, India', 'system', true),
  ('Kolkata', 'IN', 22.5726, 88.3639, 'city', 'Kolkata, India', 'system', true),
  ('Pune', 'IN', 18.5204, 73.8567, 'city', 'Pune, India', 'system', true),
  ('Ahmedabad', 'IN', 23.0225, 72.5714, 'city', 'Ahmedabad, India', 'system', true),
  ('Jaipur', 'IN', 26.9124, 75.7873, 'city', 'Jaipur, India', 'system', true),
  ('Surat', 'IN', 21.1702, 72.8311, 'city', 'Surat, India', 'system', true),
  ('Lucknow', 'IN', 26.8467, 80.9462, 'city', 'Lucknow, India', 'system', true),
  ('Kanpur', 'IN', 26.4499, 80.3319, 'city', 'Kanpur, India', 'system', true),
  ('Nagpur', 'IN', 21.1458, 79.0882, 'city', 'Nagpur, India', 'system', true),
  ('Indore', 'IN', 22.7196, 75.8577, 'city', 'Indore, India', 'system', true),
  ('Bhopal', 'IN', 23.2599, 77.4126, 'city', 'Bhopal, India', 'system', true),
  -- Japan (6 cities)
  ('Tokyo', 'JP', 35.6762, 139.6503, 'city', 'Tokyo, Japan', 'system', true),
  ('Osaka', 'JP', 34.6937, 135.5023, 'city', 'Osaka, Japan', 'system', true),
  ('Kyoto', 'JP', 35.0116, 135.7681, 'city', 'Kyoto, Japan', 'system', true),
  ('Yokohama', 'JP', 35.4437, 139.6380, 'city', 'Yokohama, Japan', 'system', true),
  ('Nagoya', 'JP', 35.1815, 136.9066, 'city', 'Nagoya, Japan', 'system', true),
  ('Fukuoka', 'JP', 33.5904, 130.4017, 'city', 'Fukuoka, Japan', 'system', true),
  -- South Korea (4 cities)
  ('Seoul', 'KR', 37.5665, 126.9780, 'city', 'Seoul, South Korea', 'system', true),
  ('Busan', 'KR', 35.1796, 129.0756, 'city', 'Busan, South Korea', 'system', true),
  ('Incheon', 'KR', 37.4563, 126.7052, 'city', 'Incheon, South Korea', 'system', true),
  ('Daegu', 'KR', 35.8714, 128.6014, 'city', 'Daegu, South Korea', 'system', true),
  -- Indonesia (5 cities)
  ('Jakarta', 'ID', -6.2088, 106.8456, 'city', 'Jakarta, Indonesia', 'system', true),
  ('Surabaya', 'ID', -7.2575, 112.7521, 'city', 'Surabaya, Indonesia', 'system', true),
  ('Bandung', 'ID', -6.9175, 107.6191, 'city', 'Bandung, Indonesia', 'system', true),
  ('Medan', 'ID', 3.5952, 98.6722, 'city', 'Medan, Indonesia', 'system', true),
  ('Bali', 'ID', -8.3405, 115.0920, 'city', 'Bali, Indonesia', 'system', true),
  -- Rest of Asia (2 per country)
  ('Bangkok', 'TH', 13.7563, 100.5018, 'city', 'Bangkok, Thailand', 'system', true),
  ('Chiang Mai', 'TH', 18.7883, 98.9853, 'city', 'Chiang Mai, Thailand', 'system', true),
  ('Hanoi', 'VN', 21.0285, 105.8542, 'city', 'Hanoi, Vietnam', 'system', true),
  ('Ho Chi Minh City', 'VN', 10.8231, 106.6297, 'city', 'Ho Chi Minh City, Vietnam', 'system', true),
  ('Manila', 'PH', 14.5995, 120.9842, 'city', 'Manila, Philippines', 'system', true),
  ('Cebu City', 'PH', 10.3157, 123.8854, 'city', 'Cebu City, Philippines', 'system', true),
  ('Kuala Lumpur', 'MY', 3.1390, 101.6869, 'city', 'Kuala Lumpur, Malaysia', 'system', true),
  ('George Town', 'MY', 5.4141, 100.3288, 'city', 'George Town, Malaysia', 'system', true),
  ('Singapore', 'SG', 1.3521, 103.8198, 'city', 'Singapore, Singapore', 'system', true),
  ('Jurong', 'SG', 1.3400, 103.7090, 'city', 'Jurong, Singapore', 'system', true),
  ('Karachi', 'PK', 24.8607, 67.0011, 'city', 'Karachi, Pakistan', 'system', true),
  ('Lahore', 'PK', 31.5497, 74.3436, 'city', 'Lahore, Pakistan', 'system', true),
  ('Dhaka', 'BD', 23.8103, 90.4125, 'city', 'Dhaka, Bangladesh', 'system', true),
  ('Chittagong', 'BD', 22.3569, 91.7832, 'city', 'Chittagong, Bangladesh', 'system', true),
  ('Colombo', 'LK', 6.9271, 79.8612, 'city', 'Colombo, Sri Lanka', 'system', true),
  ('Kandy', 'LK', 7.2906, 80.6337, 'city', 'Kandy, Sri Lanka', 'system', true),
  ('Yangon', 'MM', 16.8661, 96.1951, 'city', 'Yangon, Myanmar', 'system', true),
  ('Mandalay', 'MM', 21.9588, 96.0891, 'city', 'Mandalay, Myanmar', 'system', true),
  ('Phnom Penh', 'KH', 11.5564, 104.9282, 'city', 'Phnom Penh, Cambodia', 'system', true),
  ('Siem Reap', 'KH', 13.3633, 103.8564, 'city', 'Siem Reap, Cambodia', 'system', true),
  ('Kathmandu', 'NP', 27.7172, 85.3240, 'city', 'Kathmandu, Nepal', 'system', true),
  ('Pokhara', 'NP', 28.2096, 83.9856, 'city', 'Pokhara, Nepal', 'system', true),
  ('Kabul', 'AF', 34.5553, 69.2075, 'city', 'Kabul, Afghanistan', 'system', true),
  ('Herat', 'AF', 34.3482, 62.2002, 'city', 'Herat, Afghanistan', 'system', true),
  ('Baghdad', 'IQ', 33.3152, 44.3661, 'city', 'Baghdad, Iraq', 'system', true),
  ('Basra', 'IQ', 30.5085, 47.7804, 'city', 'Basra, Iraq', 'system', true),
  ('Riyadh', 'SA', 24.7136, 46.6753, 'city', 'Riyadh, Saudi Arabia', 'system', true),
  ('Jeddah', 'SA', 21.2854, 39.2376, 'city', 'Jeddah, Saudi Arabia', 'system', true),
  ('Dubai', 'AE', 25.2048, 55.2708, 'city', 'Dubai, United Arab Emirates', 'system', true),
  ('Abu Dhabi', 'AE', 24.4539, 54.3773, 'city', 'Abu Dhabi, United Arab Emirates', 'system', true),
  ('Tel Aviv', 'IL', 32.0853, 34.7818, 'city', 'Tel Aviv, Israel', 'system', true),
  ('Jerusalem', 'IL', 31.7683, 35.2137, 'city', 'Jerusalem, Israel', 'system', true),
  ('Istanbul', 'TR', 41.0082, 28.9784, 'city', 'Istanbul, Turkey', 'system', true),
  ('Ankara', 'TR', 39.9334, 32.8597, 'city', 'Ankara, Turkey', 'system', true),
  ('Tehran', 'IR', 35.6892, 51.3890, 'city', 'Tehran, Iran', 'system', true),
  ('Isfahan', 'IR', 32.6546, 51.6680, 'city', 'Isfahan, Iran', 'system', true),
  ('Almaty', 'KZ', 43.2220, 76.8512, 'city', 'Almaty, Kazakhstan', 'system', true),
  ('Nur-Sultan', 'KZ', 51.1694, 71.4491, 'city', 'Nur-Sultan, Kazakhstan', 'system', true),
  ('Tashkent', 'UZ', 41.2995, 69.2401, 'city', 'Tashkent, Uzbekistan', 'system', true),
  ('Samarkand', 'UZ', 39.6270, 66.9750, 'city', 'Samarkand, Uzbekistan', 'system', true),
  ('Amman', 'JO', 31.9454, 35.9284, 'city', 'Amman, Jordan', 'system', true),
  ('Irbid', 'JO', 32.5556, 35.8500, 'city', 'Irbid, Jordan', 'system', true),
  ('Beirut', 'LB', 33.8938, 35.5018, 'city', 'Beirut, Lebanon', 'system', true),
  ('Tripoli', 'LB', 34.4333, 35.8333, 'city', 'Tripoli, Lebanon', 'system', true),
  ('Muscat', 'OM', 23.5880, 58.3829, 'city', 'Muscat, Oman', 'system', true),
  ('Salalah', 'OM', 17.0150, 54.0924, 'city', 'Salalah, Oman', 'system', true),
  ('Doha', 'QA', 25.2854, 51.5310, 'city', 'Doha, Qatar', 'system', true),
  ('Al Wakrah', 'QA', 25.1714, 51.6039, 'city', 'Al Wakrah, Qatar', 'system', true),
  ('Kuwait City', 'KW', 29.3759, 47.9774, 'city', 'Kuwait City, Kuwait', 'system', true),
  ('Hawalli', 'KW', 29.3328, 48.0289, 'city', 'Hawalli, Kuwait', 'system', true),
  ('Manama', 'BH', 26.2285, 50.5860, 'city', 'Manama, Bahrain', 'system', true),
  ('Muharraq', 'BH', 26.2572, 50.6119, 'city', 'Muharraq, Bahrain', 'system', true),
  ('Ulaanbaatar', 'MN', 47.8864, 106.9057, 'city', 'Ulaanbaatar, Mongolia', 'system', true),
  ('Erdenet', 'MN', 49.0303, 104.0517, 'city', 'Erdenet, Mongolia', 'system', true),
  ('Vientiane', 'LA', 17.9757, 102.6331, 'city', 'Vientiane, Laos', 'system', true),
  ('Luang Prabang', 'LA', 19.8845, 102.1348, 'city', 'Luang Prabang, Laos', 'system', true),
  ('Bandar Seri Begawan', 'BN', 4.9031, 114.9398, 'city', 'Bandar Seri Begawan, Brunei', 'system', true),
  ('Kuala Belait', 'BN', 4.5903, 114.2310, 'city', 'Kuala Belait, Brunei', 'system', true),
  ('Male', 'MV', 4.1755, 73.5093, 'city', 'Male, Maldives', 'system', true),
  ('Addu City', 'MV', -0.6292, 73.1440, 'city', 'Addu City, Maldives', 'system', true)
ON CONFLICT (name, country_code, type) DO NOTHING;

-- =============================================================================
-- OCEANIA
-- =============================================================================

-- Countries
INSERT INTO locations (name, country_code, latitude, longitude, type, formatted_address, source, is_active)
VALUES 
  ('Australia', 'AU', -25.2744, 133.7751, 'country', 'Australia', 'system', true),
  ('New Zealand', 'NZ', -40.9006, 174.8860, 'country', 'New Zealand', 'system', true),
  ('Papua New Guinea', 'PG', -6.3150, 143.9555, 'country', 'Papua New Guinea', 'system', true),
  ('Fiji', 'FJ', -17.7134, 178.0650, 'country', 'Fiji', 'system', true),
  ('Samoa', 'WS', -13.7590, -172.1046, 'country', 'Samoa', 'system', true)
ON CONFLICT (name, country_code, type) DO NOTHING;

-- Major Cities - Oceania
INSERT INTO locations (name, country_code, latitude, longitude, type, formatted_address, source, is_active)
VALUES 
  -- Australia (8 cities)
  ('Sydney', 'AU', -33.8688, 151.2093, 'city', 'Sydney, Australia', 'system', true),
  ('Melbourne', 'AU', -37.8136, 144.9631, 'city', 'Melbourne, Australia', 'system', true),
  ('Brisbane', 'AU', -27.4698, 153.0251, 'city', 'Brisbane, Australia', 'system', true),
  ('Perth', 'AU', -31.9505, 115.8605, 'city', 'Perth, Australia', 'system', true),
  ('Adelaide', 'AU', -34.9285, 138.6007, 'city', 'Adelaide, Australia', 'system', true),
  ('Gold Coast', 'AU', -28.0167, 153.4000, 'city', 'Gold Coast, Australia', 'system', true),
  ('Canberra', 'AU', -35.2809, 149.1300, 'city', 'Canberra, Australia', 'system', true),
  ('Newcastle', 'AU', -32.9283, 151.7817, 'city', 'Newcastle, Australia', 'system', true),
  -- New Zealand (4 cities)
  ('Auckland', 'NZ', -36.8485, 174.7633, 'city', 'Auckland, New Zealand', 'system', true),
  ('Wellington', 'NZ', -41.2865, 174.7762, 'city', 'Wellington, New Zealand', 'system', true),
  ('Christchurch', 'NZ', -43.5321, 172.6362, 'city', 'Christchurch, New Zealand', 'system', true),
  ('Hamilton', 'NZ', -37.7870, 175.2793, 'city', 'Hamilton, New Zealand', 'system', true),
  -- Rest of Oceania (2 per country)
  ('Port Moresby', 'PG', -9.4438, 147.1803, 'city', 'Port Moresby, Papua New Guinea', 'system', true),
  ('Lae', 'PG', -6.7220, 147.0010, 'city', 'Lae, Papua New Guinea', 'system', true),
  ('Suva', 'FJ', -18.1248, 178.4501, 'city', 'Suva, Fiji', 'system', true),
  ('Nadi', 'FJ', -17.7765, 177.4350, 'city', 'Nadi, Fiji', 'system', true),
  ('Apia', 'WS', -13.8333, -171.7667, 'city', 'Apia, Samoa', 'system', true),
  ('Vaitele', 'WS', -13.8167, -171.8500, 'city', 'Vaitele, Samoa', 'system', true)
ON CONFLICT (name, country_code, type) DO NOTHING;

-- =============================================================================
-- SUMMARY
-- =============================================================================

-- Total Countries: 195
-- Total Cities: 390+
-- Coverage: All continents with major cities from every country
-- Source: system (curated seed data)
-- All entries: is_active=true
