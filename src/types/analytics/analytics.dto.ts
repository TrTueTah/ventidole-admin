// Analytics DTOs based on API response structure

export type TrendType = 'increase' | 'decrease' | 'stable';

export type MetricDto = {
  label: string;
  value: number;
  percentageChange: number;
  trend: TrendType;
  previousValue: number;
};

export type TimeSeriesDataPoint = {
  period: string;
  value: number;
};

export type ChartDto = {
  title: string;
  data: TimeSeriesDataPoint[];
};

// Ecommerce specific types
export type TopProductDto = {
  id: string;
  name: string;
  revenue: number;
  orders: number;
};

export type TopCategoryDto = {
  id: string;
  name: string;
  revenue: number;
  orders: number;
};

export type EcommerceTablesDto = {
  topProducts: TopProductDto[];
  topCategories: TopCategoryDto[];
};

export type EcommerceAnalyticsDto = {
  metrics: MetricDto[];
  charts: ChartDto[];
  tables: EcommerceTablesDto;
};

// Social specific types
export type TopPostDto = {
  id: string;
  title: string;
  likes: number;
  comments: number;
  views: number;
  engagement: number;
};

export type TopCommunityDto = {
  id: string;
  name: string;
  members: number;
  posts: number;
};

export type SocialTablesDto = {
  topPosts: TopPostDto[];
  topCommunities: TopCommunityDto[];
};

export type SocialAnalyticsDto = {
  metrics: MetricDto[];
  charts: ChartDto[];
  tables: SocialTablesDto;
};
