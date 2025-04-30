import React, { useState, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { Colors } from "@/constants/Theme";

type Props = {
  value: number;
  setValue: (val: number) => void;
};

export default function AlertThresholdSlider({ value, setValue }: Props) {
  const sliderRef = useRef<any>(null);

  const formatLabel = (val: number) => (val === 999 ? "Never" : `${val} units`);

  const snapPoints = [
    { val: 0, pos: 0 },
    { val: 50, pos: 50 },
    { val: 100, pos: 100 },
    { val: 999, pos: 150 },
  ];

  const onSlidingComplete = (raw: number) => {
    let nearest = snapPoints[0];
    snapPoints.forEach((sp) => {
      if (Math.abs(raw - sp.pos) < Math.abs(raw - nearest.pos)) {
        nearest = sp;
      }
    });
    setValue(nearest.val);
    sliderRef.current?.setNativeProps({ value: nearest.pos });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.value}>{formatLabel(value)}</Text>

      <View style={styles.sliderWrapper}>
        {/* overlayed thicker markers */}

        <Slider
          ref={sliderRef}
          style={styles.slider}
          minimumValue={0}
          maximumValue={150}
          step={1}
          minimumTrackTintColor={Colors.accent}
          maximumTrackTintColor={Colors.secondary}
          thumbTintColor={Colors.accent}
          onSlidingComplete={onSlidingComplete}
        />
        <View style={styles.labels}>
          {snapPoints.map((pt) => (
            <View key={pt.val} style={styles.markerContainer}>
              <View
                style={[styles.marker, value >= pt.val && styles.activeMarker]}
              />

              <Text style={styles.tick}>
                {pt.val === 999 ? "Never" : pt.val}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  value: {
    fontSize: 20,
    color: Colors.accent,
    fontWeight: "700",
    textAlign: "center",
  },
  sliderWrapper: {
    position: "relative",
    width: "100%",
    height: 80,
    justifyContent: "center",
  },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: -1,
  },
  slider: {
    width: "93%",
    alignSelf: "center",
    height: 0,
    marginBottom: -7,
  },
  markerContainer: {
    alignItems: "center",
  },
  marker: {
    width: 12,
    height: 12,
    borderRadius: 200,
    backgroundColor: Colors.secondary,
    marginBottom: 6,
  },
  activeMarker: {
    backgroundColor: Colors.accent,
    width: 13,
    height: 13,
    borderRadius: 7,
  },
  tick: {
    fontSize: 16,
    color: Colors.secondary,
    textAlign: "center",
    width: 60,
  },
});
