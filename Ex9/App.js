import React, { useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  Text, 
  Modal,
  Dimensions,
  ScrollView 
} from 'react-native';
import Svg, { Circle, Rect, Line, Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [selectedTool, setSelectedTool] = useState('free');
  const [shapes, setShapes] = useState([]);
  const [currentShape, setCurrentShape] = useState(null);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [showToolPicker, setShowToolPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleTouchStart = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    
    if (selectedTool === 'eraser') {
      // Find and remove shapes near the touch point
      const eraserRadius = 30;
      const filteredShapes = shapes.filter(shape => {
        if (shape.type === 'free') {
          // Check if any point in the path is near the eraser
          const pathPoints = shape.path.split(/[ML]/).filter(p => p.trim());
          for (let point of pathPoints) {
            const coords = point.trim().split(' ');
            if (coords.length >= 2) {
              const px = parseFloat(coords[0]);
              const py = parseFloat(coords[1]);
              const distance = Math.sqrt(
                Math.pow(locationX - px, 2) + Math.pow(locationY - py, 2)
              );
              if (distance <= eraserRadius) {
                return false; // Remove this shape
              }
            }
          }
          return true; // Keep shape
        }
        const centerX = (shape.startX + shape.endX) / 2;
        const centerY = (shape.startY + shape.endY) / 2;
        const distance = Math.sqrt(
          Math.pow(locationX - centerX, 2) + Math.pow(locationY - centerY, 2)
        );
        return distance > eraserRadius;
      });
      setShapes(filteredShapes);
      return;
    }
    
    const newShape = {
      type: selectedTool,
      startX: locationX,
      startY: locationY,
      endX: locationX,
      endY: locationY,
      color: selectedColor,
      path: selectedTool === 'free' ? `M ${locationX} ${locationY}` : '',
    };
    
    setCurrentShape(newShape);
  };

  const handleTouchMove = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    
    if (selectedTool === 'eraser') {
      // Continue erasing while moving
      const eraserRadius = 30;
      const filteredShapes = shapes.filter(shape => {
        if (shape.type === 'free') {
          // Check if any point in the path is near the eraser
          const pathPoints = shape.path.split(/[ML]/).filter(p => p.trim());
          for (let point of pathPoints) {
            const coords = point.trim().split(' ');
            if (coords.length >= 2) {
              const px = parseFloat(coords[0]);
              const py = parseFloat(coords[1]);
              const distance = Math.sqrt(
                Math.pow(locationX - px, 2) + Math.pow(locationY - py, 2)
              );
              if (distance <= eraserRadius) {
                return false; // Remove this shape
              }
            }
          }
          return true; // Keep shape
        }
        const centerX = (shape.startX + shape.endX) / 2;
        const centerY = (shape.startY + shape.endY) / 2;
        const distance = Math.sqrt(
          Math.pow(locationX - centerX, 2) + Math.pow(locationY - centerY, 2)
        );
        return distance > eraserRadius;
      });
      setShapes(filteredShapes);
      return;
    }
    
    if (!currentShape) return;
    
    if (selectedTool === 'free') {
      setCurrentShape({
        ...currentShape,
        path: currentShape.path + ` L ${locationX} ${locationY}`,
      });
    } else {
      setCurrentShape({
        ...currentShape,
        endX: locationX,
        endY: locationY,
      });
    }
  };

  const handleTouchEnd = () => {
    if (currentShape && selectedTool !== 'eraser') {
      setShapes([...shapes, currentShape]);
      setCurrentShape(null);
    }
  };

  const clearCanvas = () => {
    setShapes([]);
    setCurrentShape(null);
  };

  const renderShape = (shape, index) => {
    const key = `shape-${index}`;
    
    switch (shape.type) {
      case 'circle':
        const centerX = (shape.startX + shape.endX) / 2;
        const centerY = (shape.startY + shape.endY) / 2;
        const radius = Math.sqrt(
          Math.pow(shape.endX - shape.startX, 2) + 
          Math.pow(shape.endY - shape.startY, 2)
        ) / 2;
        return (
          <Circle
            key={key}
            cx={centerX}
            cy={centerY}
            r={radius}
            stroke={shape.color}
            strokeWidth="2"
            fill="none"
          />
        );
      
      case 'rectangle':
        const rectX = Math.min(shape.startX, shape.endX);
        const rectY = Math.min(shape.startY, shape.endY);
        const rectWidth = Math.abs(shape.endX - shape.startX);
        const rectHeight = Math.abs(shape.endY - shape.startY);
        return (
          <Rect
            key={key}
            x={rectX}
            y={rectY}
            width={rectWidth}
            height={rectHeight}
            stroke={shape.color}
            strokeWidth="2"
            fill="none"
          />
        );
      
      case 'line':
        return (
          <Line
            key={key}
            x1={shape.startX}
            y1={shape.startY}
            x2={shape.endX}
            y2={shape.endY}
            stroke={shape.color}
            strokeWidth="2"
          />
        );
      
      case 'free':
        return (
          <Path
            key={key}
            d={shape.path}
            stroke={shape.color}
            strokeWidth="2"
            fill="none"
          />
        );
      
      default:
        return null;
    }
  };

  const colors = [
    { name: 'Black', value: '#000000' },
    { name: 'Red', value: '#FF0000' },
    { name: 'Green', value: '#00FF00' },
    { name: 'Blue', value: '#0000FF' },
    { name: 'Yellow', value: '#FFFF00' },
    { name: 'Magenta', value: '#FF00FF' },
    { name: 'Cyan', value: '#00FFFF' },
    { name: 'Orange', value: '#FF8800' },
    { name: 'Purple', value: '#8800FF' },
    { name: 'Pink', value: '#FF66CC' },
  ];
  
  const tools = [
    { name: 'free', label: 'Free Draw', icon: '✏️' },
    { name: 'line', label: 'Line', icon: '📏' },
    { name: 'circle', label: 'Circle', icon: '⭕' },
    { name: 'rectangle', label: 'Rectangle', icon: '▭' },
    { name: 'eraser', label: 'Eraser', icon: '🧹' },
  ];

  const currentColor = colors.find(c => c.value === selectedColor);
  const currentTool = tools.find(t => t.name === selectedTool);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Toolbar */}
      <View style={styles.toolbar}>
        <View style={styles.toolbarContent}>
          {/* Tool Selector */}
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowToolPicker(true)}
          >
            <Text style={styles.dropdownIcon}>{currentTool.icon}</Text>
            <Text style={styles.dropdownText}>{currentTool.label}</Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>

          {/* Color Selector */}
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowColorPicker(true)}
          >
            <View style={[styles.colorPreview, { backgroundColor: selectedColor }]} />
            <Text style={styles.dropdownText}>{currentColor.name}</Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>

          {/* Clear Button */}
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearCanvas}
          >
            <Text style={styles.clearIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Canvas */}
      <View
        style={styles.canvas}
        onStartShouldSetResponder={() => true}
        onResponderGrant={handleTouchStart}
        onResponderMove={handleTouchMove}
        onResponderRelease={handleTouchEnd}
      >
        <Svg width={width} height={height - 80}>
          {shapes.map((shape, index) => renderShape(shape, index))}
          {currentShape && renderShape(currentShape, 'current')}
        </Svg>
      </View>

      {/* Tool Picker Modal */}
      <Modal
        visible={showToolPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowToolPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowToolPicker(false)}
        >
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerTitle}>Select Tool</Text>
            {tools.map((tool) => (
              <TouchableOpacity
                key={tool.name}
                style={[
                  styles.pickerItem,
                  selectedTool === tool.name && styles.pickerItemSelected,
                ]}
                onPress={() => {
                  setSelectedTool(tool.name);
                  setShowToolPicker(false);
                }}
              >
                <Text style={styles.pickerIcon}>{tool.icon}</Text>
                <Text style={styles.pickerLabel}>{tool.label}</Text>
                {selectedTool === tool.name && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Color Picker Modal */}
      <Modal
        visible={showColorPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowColorPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowColorPicker(false)}
        >
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerTitle}>Select Color</Text>
            <ScrollView style={styles.pickerScrollView}>
              {colors.map((color) => (
                <TouchableOpacity
                  key={color.value}
                  style={[
                    styles.pickerItem,
                    selectedColor === color.value && styles.pickerItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedColor(color.value);
                    setShowColorPicker(false);
                  }}
                >
                  <View style={[styles.colorSwatch, { backgroundColor: color.value }]} />
                  <Text style={styles.pickerLabel}>{color.name}</Text>
                  {selectedColor === color.value && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  toolbar: {
    backgroundColor: '#ffffff',
    paddingTop: 40,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  toolbarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    flex: 1,
    marginRight: 8,
  },
  dropdownIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  dropdownText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 10,
    color: '#666',
    marginLeft: 4,
  },
  colorPreview: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  clearButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearIcon: {
    fontSize: 20,
  },
  canvas: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: width * 0.8,
    maxHeight: height * 0.7,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  pickerScrollView: {
    maxHeight: height * 0.5,
  },
  pickerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  pickerItemSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196F3',
  },
  pickerIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  colorSwatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  checkmark: {
    fontSize: 20,
    color: '#2196F3',
    fontWeight: 'bold',
  },
});
