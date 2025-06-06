import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Colors, Fonts } from "@/constants/Theme";
import { useTheme } from "@/context/ThemeContext";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import { Svg } from "react-native-svg";
import Swiper from 'react-native-swiper';

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

const pieChartData = [
  {
    name: "Cosmetics",
    population: 215,
    color: "#1f77b4",
    legendFontColor: Colors.text,
    legendFontSize: 15,
  },
  {
    name: "Processed food",
    population: 280,
    color: "#2ca02c",
    legendFontColor: Colors.text,
    legendFontSize: 15,
  },
  {
    name: "Dairy Products",
    population: 853,
    color: "#ff7f0e",
    legendFontColor: Colors.text,
    legendFontSize: 15,
  },
  {
    name: "Beverages",
    population: 100,
    color: "#d62728",
    legendFontColor: Colors.text,
    legendFontSize: 15,
  },
];

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

const CategoryDistributionChart = ({ chartConfig }: { chartConfig: any }) => (
  <View style={styles.chartCard}>
    <Text style={styles.chartTitle}>Category Distribution</Text>
    <PieChart
      data={pieChartData}
      width={screenWidth * 0.6}
      height={150}
      chartConfig={chartConfig}
      accessor={"population"}
      backgroundColor={"transparent"}
      
      paddingLeft={"10"}
      absolute
      style={styles.chartStyle}
    />
  </View>
);

const TopItemsByQuantityChart = ({ chartConfig }: { chartConfig: any }) => (
  <View style={styles.chartCard}>
    <Text style={styles.chartTitle}>Top Items by Quantity</Text>
    <BarChart
      data={barChartData}
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
      <View style={styles.criticalProductChart}>
        <LineChart
          data={product.chartData}
          width={80}
          height={40}
          chartConfig={chartConfig}
          withHorizontalLabels={false}
          withVerticalLabels={false}
          withDots={false}
          bezier
          style={styles.chartStyle}
        />
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
const TopSellingProductItem: React.FC<TopSellingProductItemProps> = ({ product, chartConfig, styles }) => (
  <View style={styles.summaryCard}>
    <LineChart
      data={product.chartData}
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

// Component to render all Top Selling Products in Analytics
const TopSellingProductsList: React.FC<TopSellingProductsListProps> = ({ topSellingProductsData, chartConfig, styles, smallChartConfig }) => (
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

const AnalyticsContent: React.FC<AnalyticsContentProps> = ({ chartConfig, styles, smallChartConfig }) => (
  <ScrollView style={styles.analyticsScrollView}>
    <View style={styles.salesCard}>
      <View style={styles.salesIconPlaceholder} />
      <Text style={styles.salesLabel}>Todays Sales</Text>
      <Text style={styles.salesValue}>321 Units</Text>
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
        data={barChartData}
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
        topSellingProductsData={topSellingProductsListData}
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

  // Define chartConfig here so it's available to components
  const chartConfig = {
    backgroundColor: "transparent",
    backgroundGradientFrom: Colors.light,
    backgroundGradientTo: Colors.light,
    decimalPlaces: 0, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(126, 209, 167, ${opacity})`, // Using accent color
    labelColor: (opacity = 1) => `rgba(${theme === 'light' ? '27, 40, 33' : '251, 254, 252'}, ${opacity})`, // Text color based on theme
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
    strokeWidth: 2, // Add strokeWidth here for bolder line
  };

  // Define a separate chartConfig for smaller charts if needed
  const smallChartConfig = {
    backgroundColor: "transparent",
    backgroundGradientFrom: Colors.light,
    backgroundGradientTo: Colors.light,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(126, 209, 167, ${opacity})`, // Using accent color
    strokeWidth: 2, // Adjust stroke width for smaller charts
    propsForDots: { // Adjust or remove dots for smaller charts
      r: "2", // Smaller dot radius
      strokeWidth: "1", // Smaller dot border
      stroke: Colors.accent,
    },
    // labelColor and propsForLabels might not be needed for very small charts without labels
  };

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
          <StockSummaryCards summaryData={summaryCardsData} chartConfig={chartConfig} styles={styles} />
          <CategoryDistributionChart chartConfig={chartConfig} />
          <TopItemsByQuantityChart chartConfig={chartConfig} />
          <StockCriticalProducts criticalProductsData={criticalProductsListData} chartConfig={chartConfig} styles={styles} />
        </View>
      ) : (
        <AnalyticsContent chartConfig={chartConfig} styles={styles} smallChartConfig={smallChartConfig} />
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
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
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
    elevation: 2,
    
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
    backgroundColor: Colors.light,
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    marginBottom: 20,
    paddingBottom:80,
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
    height: '100%',
    
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
});

