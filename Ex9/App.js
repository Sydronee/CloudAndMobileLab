import React, { useState, useRef, useEffect } from 'react';
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
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [selectedTool, setSelectedTool] = useState('free');
  const [strokes, setStrokes] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [currentStroke, setCurrentStroke] = useState(null);
  const [currentShape, setCurrentShape] = useState(null);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [showToolPicker, setShowToolPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [penSize, setPenSize] = useState(4);
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const canvasWidth = Math.floor(width);
  const canvasHeight = Math.floor(height - 80);

  // Convert HSL to Hex
  const hslToHex = (h, s, l) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  // Update selected color when HSL changes
  useEffect(() => {
    setSelectedColor(hslToHex(hue, saturation, lightness));
  }, [hue, saturation, lightness]);

  const handleTouchStart = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    
    if (selectedTool === 'eraser') {
      // Start erasing - remove strokes and shapes that intersect with touch point
      const eraserRadius = 30;
      const filteredStrokes = strokes.filter(stroke => {
        // Check if any point in the stroke is within eraser radius
        return !stroke.points.some(point => {
          const distance = Math.sqrt(
            Math.pow(locationX - point.x, 2) + Math.pow(locationY - point.y, 2)
          );
          return distance <= eraserRadius;
        });
      });
      setStrokes(filteredStrokes);
      
      const filteredShapes = shapes.filter(shape => {
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
    
    if (selectedTool === 'free') {
      const newStroke = {
        color: selectedColor,
        size: penSize,
        points: [{ x: locationX, y: locationY }],
      };
      setCurrentStroke(newStroke);
    } else {
      // Shape tools: line, circle, rectangle
      const newShape = {
        type: selectedTool,
        startX: locationX,
        startY: locationY,
        endX: locationX,
        endY: locationY,
        color: selectedColor,
      };
      setCurrentShape(newShape);
    }
  };

  const handleTouchMove = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    
    if (selectedTool === 'eraser') {
      // Continue erasing while moving
      const eraserRadius = 30;
      const filteredStrokes = strokes.filter(stroke => {
        return !stroke.points.some(point => {
          const distance = Math.sqrt(
            Math.pow(locationX - point.x, 2) + Math.pow(locationY - point.y, 2)
          );
          return distance <= eraserRadius;
        });
      });
      setStrokes(filteredStrokes);
      
      const filteredShapes = shapes.filter(shape => {
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
    
    if (selectedTool === 'free' && currentStroke) {
      setCurrentStroke({
        ...currentStroke,
        points: [...currentStroke.points, { x: locationX, y: locationY }],
      });
    } else if (currentShape) {
      setCurrentShape({
        ...currentShape,
        endX: locationX,
        endY: locationY,
      });
    }
  };

  const handleTouchEnd = () => {
    if (currentStroke && selectedTool === 'free') {
      setStrokes([...strokes, currentStroke]);
      setCurrentStroke(null);
    } else if (currentShape && selectedTool !== 'eraser') {
      setShapes([...shapes, currentShape]);
      setCurrentShape(null);
    }
  };

  const clearCanvas = () => {
    setStrokes([]);
    setShapes([]);
    setCurrentStroke(null);
    setCurrentShape(null);
  };

  const renderStroke = (stroke, index) => {
    if (!stroke || stroke.points.length === 0) return null;
    
    const points = stroke.points;
    const path = points.map((point, i) => {
      if (i === 0) {
        return `M ${point.x} ${point.y}`;
      }
      return `L ${point.x} ${point.y}`;
    }).join(' ');
    
    return (
      <Path
        key={index}
        d={path}
        stroke={stroke.color}
        strokeWidth={stroke.size || 4}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  };

  const renderShape = (shape, index) => {
    if (!shape) return null;
    
    const key = `shape-${index}`;
    
    switch (shape.type) {
      case 'circle':
        const centerX = (shape.startX + shape.endX) / 2;
        const centerY = (shape.startY + shape.endY) / 2;
        const radius = Math.sqrt(
          Math.pow(shape.endX - shape.startX, 2) + 
          Math.pow(shape.endY - shape.startY, 2)
        ) / 2;
        const circlePath = `
          M ${centerX - radius} ${centerY}
          A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}
          A ${radius} ${radius} 0 0 1 ${centerX - radius} ${centerY}
        `;
        return (
          <Path
            key={key}
            d={circlePath}
            stroke={shape.color}
            strokeWidth="3"
            fill="none"
          />
        );
      
      case 'rectangle':
        const rectX = Math.min(shape.startX, shape.endX);
        const rectY = Math.min(shape.startY, shape.endY);
        const rectWidth = Math.abs(shape.endX - shape.startX);
        const rectHeight = Math.abs(shape.endY - shape.startY);
        const rectPath = `
          M ${rectX} ${rectY}
          L ${rectX + rectWidth} ${rectY}
          L ${rectX + rectWidth} ${rectY + rectHeight}
          L ${rectX} ${rectY + rectHeight}
          Z
        `;
        return (
          <Path
            key={key}
            d={rectPath}
            stroke={shape.color}
            strokeWidth="3"
            fill="none"
          />
        );
      
      case 'line':
        const linePath = `M ${shape.startX} ${shape.startY} L ${shape.endX} ${shape.endY}`;
        return (
          <Path
            key={key}
            d={linePath}
            stroke={shape.color}
            strokeWidth="3"
          />
        );
      
      default:
        return null;
    }
  };

  const tools = [
    { name: 'free', label: 'Free Draw', icon: '✏️' },
    { name: 'line', label: 'Line', icon: '📏' },
    { name: 'circle', label: 'Circle', icon: '⭕' },
    { name: 'rectangle', label: 'Rectangle', icon: '▭' },
    { name: 'eraser', label: 'Eraser', icon: '🧹' },
  ];

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
            <Text style={styles.dropdownText}>Color</Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>

          {/* Size Selector (only show for free draw) */}
          {selectedTool === 'free' && (
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowSizePicker(true)}
            >
              <Text style={styles.dropdownIcon}>📝</Text>
              <Text style={styles.dropdownText}>Size: {penSize}</Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
          )}

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
          {strokes.map((stroke, index) => renderStroke(stroke, index))}
          {currentShape && renderShape(currentShape, 'current')}
          {currentStroke && renderStroke(currentStroke, 'current')}
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

      {/* Size Picker Modal */}
      <Modal
        visible={showSizePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSizePicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSizePicker(false)}
        >
          <View style={styles.sizePickerContainer}>
            <Text style={styles.pickerTitle}>Pen Size</Text>
            
            {/* Size Preview */}
            <View style={styles.sizePreviewContainer}>
              <Svg width={150} height={100}>
                <Path
                  d="M 20 50 L 130 50"
                  stroke={selectedColor}
                  strokeWidth={penSize}
                  strokeLinecap="round"
                />
              </Svg>
              <Text style={styles.sizeValueText}>{penSize}px</Text>
            </View>

            {/* Size Slider */}
            <View style={styles.sizeSliderContainer}>
              <Text style={styles.sliderLabel}>Adjust Size</Text>
              <View
                style={styles.sizeSlider}
                onStartShouldSetResponder={() => true}
                onResponderGrant={(e) => {
                  const { locationX } = e.nativeEvent;
                  const newSize = Math.max(1, Math.min(50, Math.round((locationX / 250) * 50)));
                  setPenSize(newSize);
                }}
                onResponderMove={(e) => {
                  const { locationX } = e.nativeEvent;
                  const newSize = Math.max(1, Math.min(50, Math.round((locationX / 250) * 50)));
                  setPenSize(newSize);
                }}
              >
                <Svg width={250} height={40}>
                  {/* Slider track */}
                  <Path
                    d="M 0 20 L 250 20"
                    stroke="#ccc"
                    strokeWidth="2"
                  />
                  {/* Slider fill */}
                  <Path
                    d={`M 0 20 L ${(penSize / 50) * 250} 20`}
                    stroke="#2196F3"
                    strokeWidth="3"
                  />
                  {/* Slider thumb */}
                  <Path
                    d={`M ${(penSize / 50) * 250 - 10} 5 L ${(penSize / 50) * 250 + 10} 5 L ${(penSize / 50) * 250 + 10} 35 L ${(penSize / 50) * 250 - 10} 35 Z`}
                    fill="#2196F3"
                  />
                </Svg>
              </View>
            </View>

            {/* Quick Sizes */}
            <View style={styles.quickSizesContainer}>
              <Text style={styles.sliderLabel}>Quick Sizes</Text>
              <View style={styles.quickSizesRow}>
                {[1, 4, 8, 15, 25, 40].map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.sizeButton,
                      penSize === size && styles.sizeButtonSelected,
                    ]}
                    onPress={() => setPenSize(size)}
                  >
                    <Text style={[
                      styles.sizeButtonText,
                      penSize === size && styles.sizeButtonSelected_Text
                    ]}>{size}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Done Button */}
            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setShowSizePicker(false)}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
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
          <View style={styles.colorPickerContainer}>
            <Text style={styles.pickerTitle}>Select Color</Text>
            
            {/* Color Preview */}
            <View style={styles.colorPreviewLarge}>
              <View style={[styles.colorPreviewBox, { backgroundColor: selectedColor }]} />
              <Text style={styles.colorHexText}>{selectedColor.toUpperCase()}</Text>
            </View>

            {/* Saturation/Lightness Square */}
            <View style={styles.colorSquareContainer}>
              <View
                style={styles.colorSquare}
                onStartShouldSetResponder={() => true}
                onResponderGrant={(e) => {
                  const { locationX, locationY } = e.nativeEvent;
                  const newSat = Math.max(0, Math.min(100, (locationX / 250) * 100));
                  const newLight = Math.max(0, Math.min(100, 100 - (locationY / 250) * 100));
                  setSaturation(newSat);
                  setLightness(newLight);
                }}
                onResponderMove={(e) => {
                  const { locationX, locationY } = e.nativeEvent;
                  const newSat = Math.max(0, Math.min(100, (locationX / 250) * 100));
                  const newLight = Math.max(0, Math.min(100, 100 - (locationY / 250) * 100));
                  setSaturation(newSat);
                  setLightness(newLight);
                }}
              >
                <Svg width={250} height={250}>
                  {/* Create gradient square */}
                  {Array.from({ length: 25 }).map((_, i) => 
                    Array.from({ length: 25 }).map((_, j) => {
                      const s = (i / 24) * 100;
                      const l = 100 - (j / 24) * 100;
                      const color = hslToHex(hue, s, l);
                      return (
                        <Path
                          key={`${i}-${j}`}
                          d={`M ${i * 10} ${j * 10} l 10 0 l 0 10 l -10 0 Z`}
                          fill={color}
                          stroke="none"
                        />
                      );
                    })
                  )}
                  {/* Cursor */}
                  <Path
                    d={`M ${(saturation / 100) * 250 - 8} ${(1 - lightness / 100) * 250 - 8} 
                        l 16 0 l 0 16 l -16 0 Z`}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="3"
                  />
                  <Path
                    d={`M ${(saturation / 100) * 250 - 8} ${(1 - lightness / 100) * 250 - 8} 
                        l 16 0 l 0 16 l -16 0 Z`}
                    fill="none"
                    stroke="#000000"
                    strokeWidth="1"
                  />
                </Svg>
              </View>
            </View>

            {/* Hue Slider */}
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>Hue</Text>
              <View
                style={styles.hueSlider}
                onStartShouldSetResponder={() => true}
                onResponderGrant={(e) => {
                  const { locationX } = e.nativeEvent;
                  const newHue = Math.max(0, Math.min(360, (locationX / 250) * 360));
                  setHue(newHue);
                }}
                onResponderMove={(e) => {
                  const { locationX } = e.nativeEvent;
                  const newHue = Math.max(0, Math.min(360, (locationX / 250) * 360));
                  setHue(newHue);
                }}
              >
                <Svg width={250} height={30}>
                  {Array.from({ length: 360 }).map((_, i) => {
                    const color = hslToHex(i, 100, 50);
                    return (
                      <Path
                        key={i}
                        d={`M ${(i / 360) * 250} 0 l ${250 / 360} 0 l 0 30 l -${250 / 360} 0 Z`}
                        fill={color}
                        stroke="none"
                      />
                    );
                  })}
                  {/* Cursor */}
                  <Path
                    d={`M ${(hue / 360) * 250 - 3} 0 l 6 0 l 0 30 l -6 0 Z`}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="3"
                  />
                  <Path
                    d={`M ${(hue / 360) * 250 - 3} 0 l 6 0 l 0 30 l -6 0 Z`}
                    fill="none"
                    stroke="#000000"
                    strokeWidth="1"
                  />
                </Svg>
              </View>
            </View>

            {/* Quick Colors */}
            <View style={styles.quickColorsContainer}>
              <Text style={styles.sliderLabel}>Quick Colors</Text>
              <View style={styles.quickColorsRow}>
                {[
                  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
                  '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080'
                ].map((color) => (
                  <TouchableOpacity
                    key={color}
                    onPress={() => {
                      // Convert hex to HSL
                      const r = parseInt(color.slice(1, 3), 16) / 255;
                      const g = parseInt(color.slice(3, 5), 16) / 255;
                      const b = parseInt(color.slice(5, 7), 16) / 255;
                      const max = Math.max(r, g, b);
                      const min = Math.min(r, g, b);
                      let h = 0, s = 0, l = (max + min) / 2;

                      if (max !== min) {
                        const d = max - min;
                        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                        switch (max) {
                          case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                          case g: h = ((b - r) / d + 2) / 6; break;
                          case b: h = ((r - g) / d + 4) / 6; break;
                        }
                      }

                      setHue(Math.round(h * 360));
                      setSaturation(Math.round(s * 100));
                      setLightness(Math.round(l * 100));
                    }}
                  >
                    <View style={[styles.quickColorSwatch, { backgroundColor: color }]} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Done Button */}
            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setShowColorPicker(false)}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
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
  colorPickerContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: width * 0.85,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  colorPreviewLarge: {
    alignItems: 'center',
    marginBottom: 20,
  },
  colorPreviewBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#ccc',
    marginBottom: 8,
  },
  colorHexText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  colorSquareContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  colorSquare: {
    width: 250,
    height: 250,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#ccc',
  },
  sliderContainer: {
    marginBottom: 20,
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  hueSlider: {
    width: 250,
    height: 30,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#ccc',
    alignSelf: 'center',
  },
  quickColorsContainer: {
    marginBottom: 20,
  },
  quickColorsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  quickColorSwatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#ccc',
    marginBottom: 8,
  },
  doneButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sizePickerContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: width * 0.85,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  sizePreviewContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingVertical: 15,
  },
  sizeValueText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
  },
  sizeSliderContainer: {
    marginBottom: 20,
  },
  sizeSlider: {
    width: 250,
    height: 40,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#ccc',
    alignSelf: 'center',
  },
  quickSizesContainer: {
    marginBottom: 20,
  },
  quickSizesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  sizeButton: {
    flexBasis: '15%',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    marginBottom: 8,
  },
  sizeButtonSelected: {
    backgroundColor: '#2196F3',
    borderColor: '#1976D2',
  },
  sizeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  sizeButtonSelected_Text: {
    color: '#ffffff',
  },
});
