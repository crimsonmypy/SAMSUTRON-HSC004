#include <Wire.h>
#include <Adafruit_TCS34725.h>
#include "UbidotsESPMQTT.h"

// Ubidots configuration
#define TOKEN "BBUS-y5pNPRLqtyQE0IeHPF1WW5UiVge6WY"     // Your Ubidots TOKEN
#define WIFINAME "Babi_nama_hewan "  // Your SSID
#define WIFIPASS "Radolike"  // Your Wifi Pass

Ubidots client(TOKEN);

// Sensor configuration
Adafruit_TCS34725 tcs = Adafruit_TCS34725(TCS34725_INTEGRATIONTIME_50MS, TCS34725_GAIN_4X);
const int turbidityPin = 34;

void setup() {
  Serial.begin(115200);
  client.setDebug(true);  // Enable debug messages
  client.wifiConnection(WIFINAME, WIFIPASS);
  client.begin(callback);

  if (tcs.begin()) {
    Serial.println("Found TCS34725 sensor");
  } else {
    Serial.println("No TCS34725 sensor found");
    while (1);
  }
}

void loop() {
  if (!client.connected()) {
    client.reconnect();
  }

  // Read turbidity value
  int turbidityValue = analogRead(turbidityPin);
  float voltage = turbidityValue * (3.3 / 4095.0);
  float turbidityNTU = (voltage - 0.5) * 1000;

  // Publish turbidity value to Ubidots
  client.add("turbidity_value", turbidityNTU);
  client.ubidotsPublish("turbidity_source");

  // Read color data from TCS34725
  uint16_t r, g, b, c;
  tcs.getRawData(&r, &g, &b, &c);

  // Publish color data to Ubidots
  client.add("red_value", r);
  client.add("green_value", g);
  client.add("blue_value", b);
  client.ubidotsPublish("color_source");

  // Determine dominant color
  String color = "Unknown";
  if (r > g && r > b) {
    color = (g > b) ? "Yellow" : "Red";
  } else if (g > r && g > b) {
    color = "Green";
  } else if (b > r && b > g) {
    color = (r > g) ? "Purple" : "Blue";
  } else if (r == g && g == b) {
    color = "White";
  } else if (r > g && b > g) {
    color = "Magenta";
  } else if (g > r && b > r) {
    color = "Cyan";
  }

  Serial.print("Dominant Color: ");
  Serial.println(color);


  delay(1000);
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
}