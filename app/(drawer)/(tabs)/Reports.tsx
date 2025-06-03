import React, { useState, useRef, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Colors, Fonts } from "@/constants/Theme";
import { useTheme } from "@/context/ThemeContext";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import { Svg } from "react-native-svg";
import Swiper from 'react-native-swiper';
import { router } from "expo-router";
import { AuthContext } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";
import {
  getSummaryCards,
  getPieChartData,
  getLineChartData,
  getBarChartData,
  getCriticalProducts,
  getTopSellingProducts,
} from "@/api/analytics";
import SnackBar from "@/components/ui/Snackbar";

const screenWidth = Dimensions.get("window").width;

// Interfaces for component props
interface SummaryCardProps {
  value: string;
  label: string;
  trend: string;
  chartConfig: any; // Replace 'any' with a more specific chart config type if available
  chartData: any; // Replace 'any' with a more specific chart data type if available
  styles: any; // Replace 'any' with a more specific styles type if available
}

interface PieChartItem {
  name: string;
  population: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
  percentage: number;
}

interface StockCriticalProductItemProps {
  product: {
    name: string;
    category: string;
    stock: string;
    lowStock: boolean;
    chartData: any; // Chart data for the critical product
  };
  chartConfig: any; // Replace 'any' with a more specific chart config type if available
  styles: any; // Replace 'any' with a more specific styles type if available
}

interface TopSellingProductItemProps {
  product: {
    name: string;
    unitsSold: string;
    trend: string;
    chartData: any; // Chart data for the top selling product
  };
  chartConfig: any; // Replace 'any' with a more specific chart config type if available
  styles: any; // Replace 'any' with a more specific styles type if available
}

interface StockSummaryCardsProps {
  summaryData: { value: string; label: string; trend: string; chartData: any }[];
  chartConfig: any;
  styles: any;
}

interface StockCriticalProductsProps {
  criticalProductsData: { name: string; category: string; stock: string; lowStock: boolean; chartData: any }[];
  chartConfig: any;
  styles: any;
}

interface TopSellingProductsListProps {
  topSellingProductsData: { name: string; unitsSold: string; trend: string; chartData: any }[];
  chartConfig: any; // General chart config for the section if needed
  smallChartConfig: any; // Specific chart config for item charts
  styles: any;
}

interface AnalyticsContentProps {
  chartConfig: any; // General chart config for the section
  styles: any;
  smallChartConfig: any; // Specific chart config for item charts
}

interface CarouselItem {
  name: string;
  category: string;
  stock: string;
  lowStock: boolean;
  chartData: any;
}

// Calculate total population for percentage calculation
const calculatePercentages = (data: Omit<PieChartItem, 'percentage'>[]): PieChartItem[] => {
  const total = data.reduce((sum, item) => sum + item.population, 0);
  return data.map(item => ({
    ...item,
    percentage: total === 0 ? 0 : Math.round((item.population / total) * 100)
  }));
};

// Sample data for charts
const lineChartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      data: [
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100,
      ],
    },
  ],
};

const rawPieChartData = [
  {
    name: "Cosmetics",
    population: 215,
    color: "#7ED1A7",
    legendFontColor: Colors.text,
    legendFontSize: 15,
  },
  {
    name: "Processed food",
    population: 280,
    color: "#3A8C6C",
    legendFontColor: Colors.text,
    legendFontSize: 15,
  },
  {
    name: "Dairy Products",
    population: 853,
    color: "#A5E6C9",
    legendFontColor: Colors.text,
    legendFontSize: 15,
  },
  {
    name: "Beverages",
    population: 100,
    color: "#2D4A3B",
    legendFontColor: Colors.text,
    legendFontSize: 15,
  },
];

const pieChartData: PieChartItem[] = calculatePercentages(rawPieChartData);

const barChartData = {
  labels: ["Mon", "Tue", "Wed", "Today", "Fri"],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43],
    },
  ],
};

// Sample data for summary cards
const summaryCardsData = [
  { value: "436", label: "Total Stock", trend: "+10%", chartData: lineChartData },
  { value: "13", label: "Low Stock", trend: "+8%", chartData: lineChartData },
  { value: "7", label: "Out of Stock", trend: "+5%", chartData: lineChartData },
  { value: "12211", label: "Stock Value (ETB)", trend: "+2%", chartData: lineChartData },
];

// Sample data for critical products
const criticalProductsListData = [
  { 
    name: "Colgate Toothpaste", 
    category: "Cosmetics", 
    stock: "200", 
    lowStock: true, 
    chartData: lineChartData 
  },
  { 
    name: "Milk Powder", 
    category: "Dairy", 
    stock: "150", 
    lowStock: true, 
    chartData: lineChartData 
  },
  { 
    name: "Coca Cola", 
    category: "Beverages", 
    stock: "100", 
    lowStock: true, 
    chartData: lineChartData 
  },
  { 
    name: "Bread", 
    category: "Bakery", 
    stock: "50", 
    lowStock: true, 
    chartData: lineChartData 
  },
  { 
    name: "Cooking Oil", 
    category: "Groceries", 
    stock: "75", 
    lowStock: true, 
    chartData: lineChartData 
  }
];

// Sample data for top selling products
const topSellingProductsListData = [
  { name: "Product A", unitsSold: "416", trend: "+8%", chartData: lineChartData },
  { name: "Product B", unitsSold: "416", trend: "+8%", chartData: lineChartData },
  { name: "Product C", unitsSold: "212", trend: "+5%", chartData: lineChartData },
  { name: "Product D", unitsSold: "118", trend: "+2%", chartData: lineChartData },
];

// Reusable Component for Summary Cards
const SummaryCard: React.FC<SummaryCardProps> = ({ value, label, trend, chartConfig, chartData, styles }) => (
  <View style={styles.summaryCard}>
    <Text style={styles.summaryValue}>{value}</Text>
    <Text style={styles.summaryLabel}>{label}</Text>
    <Text style={styles.summaryTrend}>{trend}</Text>
  </View>
);

// Component to render all Stock Summary Cards
const StockSummaryCards: React.FC<StockSummaryCardsProps> = ({ summaryData, chartConfig, styles }) => (
  <View style={styles.summaryContainer}>
    {summaryData.map((item, index) => (
      <SummaryCard
        key={index}
        value={item.value}
        label={item.label}
        trend={item.trend}
        chartData={item.chartData}
        chartConfig={chartConfig}
        styles={styles} // Pass styles prop
      />
    ))}
  </View>
);

const CategoryDistributionChart = ({ chartConfig, data }: { chartConfig: any, data: any[] }) => (
  <View style={styles.chartCard}>
    <Text style={styles.chartTitle}>Category Distribution</Text>
    <PieChart
      data={data}
      width={screenWidth * 0.8}
      height={200}
      chartConfig={chartConfig}
      accessor={"population"}
      backgroundColor={"transparent"}
      paddingLeft={"10"}
      center={[screenWidth * 0.2, 0]}
      style={styles.chartStyle}
      hasLegend={false}
    />
    <View style={styles.legendGrid}>
      {data.map((item, index) => (
        <View key={index} style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: item.color }]} />
          <Text style={styles.legendText}>{item.name} ({item.percentage}%)</Text>
        </View>
      ))}
    </View>
  </View>
);

const TopItemsByQuantityChart = ({ chartConfig, data }: { chartConfig: any, data: any }) => (
  <View style={styles.chartCard}>
    <Text style={styles.chartTitle}>Top Items by Quantity</Text>
    <BarChart
      data={data}
      width={screenWidth - 56}
      height={200}
      chartConfig={chartConfig}
      verticalLabelRotation={0}
      fromZero={true}
      style={styles.chartStyle}
      yAxisLabel=""
      yAxisSuffix=""
    />
  </View>
);

// Reusable Component for Critical Product Item in Stock view
const StockCriticalProductItem: React.FC<StockCriticalProductItemProps> = ({ product, chartConfig, styles }) => (
   <View style={styles.criticalProductItem}>
      <View style={styles.productImagePlaceholder} />
      <View>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productCategory}>{product.category}</Text>
        <Text style={styles.productStock}>Stock: {product.stock}</Text>
        {product.lowStock && <Text style={styles.lowStockLabel}>Low stock</Text>}
      </View>
    </View>
);

const StockCriticalProducts: React.FC<StockCriticalProductsProps> = ({ criticalProductsData, chartConfig, styles }) => {
  return (
    <View style={styles.criticalProductsContainer}>
      <Text style={styles.chartTitle}>Critical Products</Text>
      <View style={styles.swiperContainer}>
        <Swiper
          autoplay
          autoplayTimeout={3}
          dot={<View style={styles.dot} />}
          activeDot={<View style={styles.activeDot} />}
          loop
            style={{}}
        >
          {criticalProductsData.map((product, index) => (
            <View key={index} style={styles.criticalProductCard}>
              <StockCriticalProductItem
                product={product}
                chartConfig={chartConfig}
                styles={styles}
              />
            </View>
          ))}
        </Swiper>
      </View>
    </View>
  );
};

// Reusable component for Top Selling Product Items in Analytics
const TopSellingProductItem: React.FC<TopSellingProductItemProps> = ({ product, chartConfig, styles }) => {
  // Create default chart data if none is provided
  const defaultChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{ data: [0, 0, 0, 0, 0, 0] }]
  };

  const chartData = product.chartData || defaultChartData;

  return (
    <View style={styles.summaryCard}>
      <LineChart
        data={chartData}
        width={screenWidth * 0.4}
        height={60}
        chartConfig={chartConfig}
        withHorizontalLabels={false}
        withVerticalLabels={false}
        withDots={false}
        bezier
        style={styles.chartStyle}
      />
      <Text style={styles.summaryValue}>{product.name}</Text>
      <Text style={styles.summaryLabel}>{product.unitsSold} units sold</Text>
      <Text style={styles.summaryTrend}>{product.trend}</Text>
    </View>
  );
};

// Component to render all Top Selling Products in Analytics
const TopSellingProductsList: React.FC<TopSellingProductsListProps> = ({ topSellingProductsData, chartConfig, styles, smallChartConfig }) => {
  // If no data is available, show a message
  if (!topSellingProductsData || topSellingProductsData.length === 0) {
    return (
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateText}>No top selling products data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.topSellingProductsList}>
      {topSellingProductsData.map((product, index) => (
        <TopSellingProductItem
          key={index}
          product={product}
          chartConfig={smallChartConfig}
          styles={styles}
        />
      ))}
    </View>
  );
};

const AnalyticsContent: React.FC<AnalyticsContentProps & { data: { barChartData: any, topSellingProducts: any[] } }> = 
  ({ chartConfig, styles, smallChartConfig, data }) => (
  <ScrollView style={styles.analyticsScrollView}>
    <View style={styles.salesCard}>
      <View style={styles.salesIconPlaceholder} />
      <Text style={styles.salesLabel}>Today's Sales</Text>
      <Text style={styles.salesValue}>
        {data.barChartData?.datasets[0]?.data[data.barChartData?.datasets[0]?.data.length - 1] || 0} Units
      </Text>
    </View>

    <View style={styles.timeToggleContainer}>
      <TouchableOpacity style={styles.timeToggleButton}>
        <Text style={styles.timeButtonText}>Daily</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.timeToggleButton, styles.activeTimeToggleButton]}>
        <Text style={[styles.timeButtonText, styles.activeTimeButtonText]}>Annual</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.timeToggleButton}>
        <Text style={styles.timeButtonText}>Weekly</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.timeToggleButton}>
        <Text style={styles.timeButtonText}>Monthly</Text>
      </TouchableOpacity>
    </View>

    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>Sales Insight</Text>
      <BarChart
        data={data.barChartData}
        width={screenWidth - 32}
        height={200}
        chartConfig={chartConfig}
        verticalLabelRotation={0}
        fromZero={true}
        style={styles.chartStyle}
        yAxisLabel=""
        yAxisSuffix=""
      />
    </View>

    <View style={styles.topSellingProductsContainer}>
      <Text style={styles.chartTitle}>Top Selling Products</Text>
      <TopSellingProductsList
        topSellingProductsData={data.topSellingProducts}
        chartConfig={chartConfig}
        smallChartConfig={smallChartConfig}
        styles={styles}
      />
    </View>
  </ScrollView>
);

export default function ReportsScreen() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('Stock');
  const { user, token } = useContext(AuthContext);
  const { currentShop } = useShop();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for all data
  const [summaryData, setSummaryData] = useState<any[]>([]);
  const [pieChartData, setPieChartData] = useState<any[]>([]);
  const [lineChartData, setLineChartData] = useState<any>(null);
  const [barChartData, setBarChartData] = useState<any>(null);
  const [criticalProducts, setCriticalProducts] = useState<any[]>([]);
  const [topSellingProducts, setTopSellingProducts] = useState<any[]>([]);

  useEffect(() => {
    // Redirect if user is not an owner
    if (user?.role !== "owner") {
      router.replace("/(drawer)/(tabs)");
    }
  }, [user?.role]);

  useEffect(() => {
    if (currentShop?.id) {
      fetchData();
    }
  }, [currentShop?.id]);

  const fetchData = async () => {
    if (!currentShop?.id || !token) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch all data in parallel
      const [
        summaryResponse,
        pieResponse,
        lineResponse,
        barResponse,
        criticalResponse,
        topSellingResponse
      ] = await Promise.all([
        getSummaryCards(token, currentShop.id),
        getPieChartData(token, currentShop.id),
        getLineChartData(token, currentShop.id),
        getBarChartData(token, currentShop.id),
        getCriticalProducts(token, currentShop.id),
        getTopSellingProducts(token, currentShop.id)
      ]);

      setSummaryData(summaryResponse.data);
      setPieChartData(pieResponse.data);
      setLineChartData(lineResponse.data);
      setBarChartData(barResponse.data);
      setCriticalProducts(criticalResponse.data);
      setTopSellingProducts(topSellingResponse.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch analytics data");
    } finally {
      setIsLoading(false);
    }
  };

  // If user is not an owner, don't render the content
  if (user?.role !== "owner") {
    return null;
  }

  // Define chartConfig here so it's available to components
  const chartConfig = {
    backgroundColor: "transparent",
    backgroundGradientFrom: Colors.light,
    backgroundGradientTo: Colors.light,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(126, 209, 167, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(${theme === 'light' ? '27, 40, 33' : '251, 254, 252'}, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "5",
      strokeWidth: "4",
      stroke: Colors.accent,
    },
    propsForLabels: {
      fontFamily: Fonts.publicSans.regular,
    },
    strokeWidth: 2,
  };

  const smallChartConfig = {
    ...chartConfig,
    propsForDots: {
      r: "2",
      strokeWidth: "1",
      stroke: Colors.accent,
    },
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: theme === "light" ? Colors.light : Colors.dark },
      ]}
    >
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            activeTab === 'Stock' && styles.activeToggleButton,
          ]}
          onPress={() => setActiveTab('Stock')}
        >
          <Text style={[
            styles.toggleButtonText,
            activeTab === 'Stock'
              ? (theme === 'light' ? styles.activeToggleTextLight : styles.activeToggleTextDark)
              : styles.inactiveToggleText,
          ]}>
            Stock
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            activeTab === 'Analytics' && styles.activeToggleButton,
          ]}
          onPress={() => setActiveTab('Analytics')}
        >
          <Text style={[
            styles.toggleButtonText,
            activeTab === 'Analytics'
              ? (theme === 'light' ? styles.activeToggleTextLight : styles.activeToggleTextDark)
              : styles.inactiveToggleText,
          ]}>
            Analytics
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'Stock' ? (
        <View>
          <StockSummaryCards summaryData={summaryData} chartConfig={chartConfig} styles={styles} />
          <CategoryDistributionChart chartConfig={chartConfig} data={pieChartData} />
          <TopItemsByQuantityChart chartConfig={chartConfig} data={barChartData} />
          <StockCriticalProducts criticalProductsData={criticalProducts} chartConfig={chartConfig} styles={styles} />
        </View>
      ) : (
        <AnalyticsContent 
          chartConfig={chartConfig} 
          styles={styles} 
          smallChartConfig={smallChartConfig}
          data={{
            barChartData,
            topSellingProducts
          }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: 20,
    marginBottom: 20,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    alignItems: 'center',
  },
  activeToggleButton: {
    backgroundColor: Colors.light,
  },
  toggleButtonText: {
    fontSize: 16,
    fontFamily: Fonts.publicSans.medium,
  },
  activeToggleTextLight: {
    color: Colors.text,
  },
  activeToggleTextDark: {
    color: Colors.textWhite,
  },
  inactiveToggleText: {
    color: Colors.secondary,
  },
  summaryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  summaryCard: {
    width: "48%",
    backgroundColor: Colors.light,
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    elevation: 3,
  },
  summaryValue: {
    fontSize: 20,
    fontFamily: Fonts.publicSans.semiBold,
    color: Colors.text,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: Fonts.publicSans.regular,
    color: Colors.secondary,
    marginBottom: 8,
  },
  chartStyle: {
    marginVertical: 8,
  },
  summaryTrend: {
    fontSize: 14,
    fontFamily: Fonts.publicSans.medium,
    color: Colors.accent,
  },
  chartCard: {
    backgroundColor: Colors.light,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontFamily: Fonts.publicSans.semiBold,
    color: Colors.text,
    marginBottom: 12,
  },
  largeChartPlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: Colors.primary,
  },
  criticalProductsContainer: {
  height: 250,
    backgroundColor: Colors.light,
    borderRadius: 8,
    marginBottom: 80,
  },
  swiperContainer:{
    flex: 1,
    marginBottom: 20,
  },
  criticalProductCard: {
    flex: 1,
    padding: 10,
  },
  dot: {
    backgroundColor: Colors.secondary,
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  activeDot: {
    backgroundColor: Colors.accent,
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  criticalProductItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: Colors.light,
    borderRadius: 8,
    elevation: 2,
    
  },
  productImagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: Colors.primary,
    marginRight: 12,
    borderRadius: 4,
  },
  productName: {
    fontSize: 16,
    fontFamily: Fonts.publicSans.medium,
    color: Colors.text,
  },
  productCategory: {
    fontSize: 12,
    fontFamily: Fonts.publicSans.regular,
    color: Colors.secondary,
  },
  productStock: {
    fontSize: 14,
    fontFamily: Fonts.publicSans.medium,
    color: Colors.text,
    marginTop: 4,
  },
  lowStockLabel: {
    fontSize: 12,
    fontFamily: Fonts.publicSans.semiBold,
    color: Colors.error,
    marginTop: 4,
  },
  analyticsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyticsScrollView: {
    flex: 1,
  },
  salesCard: {
    backgroundColor: Colors.light,
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 2,
  },
  salesIconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    marginBottom: 10,
  },
  salesLabel: {
    fontSize: 16,
    fontFamily: Fonts.publicSans.regular,
    color: Colors.secondary,
  },
  salesValue: {
    fontSize: 24,
    fontFamily: Fonts.publicSans.bold,
    color: Colors.text,
  },
  timeToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.primary,
    borderRadius: 20,
    marginBottom: 20,
    padding: 4,
  },
  timeToggleButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    alignItems: 'center',
  },
  activeTimeToggleButton: {
    backgroundColor: Colors.light,
  },
  timeButtonText: {
    fontSize: 14,
    fontFamily: Fonts.publicSans.medium,
    color: Colors.secondary,
  },
  activeTimeButtonText: {
    color: Colors.text,
  },
  topSellingProductsContainer: {
    backgroundColor: Colors.light,
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    marginTop: 20,
    paddingBottom: 100,
  },
  topSellingProductsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  criticalProductChart: {
    marginLeft: 12,
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%', // Slightly less than 50% to account for spacing
    marginBottom: 12,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    fontFamily: Fonts.publicSans.regular,
    color: Colors.text,
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: Colors.error,
    fontFamily: Fonts.publicSans.medium,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.light,
    fontFamily: Fonts.publicSans.medium,
    fontSize: 16,
  },
  emptyStateContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    color: Colors.secondary,
    fontFamily: Fonts.publicSans.medium,
    fontSize: 16,
    textAlign: 'center',
  },
});

