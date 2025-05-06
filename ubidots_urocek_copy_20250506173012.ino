#include <Wire.h>
#include <Adafruit_TCS34725.h>
#include <UbidotsESPMQTT.h>
#include <WiFiManager.h>
#include <LiquidCrystal_I2C.h>

// Ubidots configuration
#define TOKEN "BBUS-y5pNPRLqtyQE0IeHPF1WW5UiVge6WY"     // Your Ubidots TOKEN

Ubidots client(TOKEN);

// Sensor configuration
Adafruit_TCS34725 tcs = Adafruit_TCS34725(TCS34725_INTEGRATIONTIME_50MS, TCS34725_GAIN_4X);
const int turbidityPin = 14; // Pin untuk sensor turbidity
const int tdsPin = 13; // Pin untuk sensor TDS

// Inisialisasi LCD I2C dengan alamat 0x27 dan ukuran 16x2
LiquidCrystal_I2C lcd(0x27, 16, 2);

// Function to scale RGB values to 0-255 range
uint8_t scaleTo255(uint16_t value, uint16_t max_value) {
  // Prevent division by zero
  if (max_value == 0) return 0;
  
  // Scale and constrain to 0-255
  float scaled = (float)value / max_value * 255.0;
  return constrain((int)scaled, 0, 255);
}

void setup() {
  Serial.begin(115200);
  
  // Inisialisasi LCD
  lcd.init();
  lcd.backlight(); // Menyalakan backlight LCD

  // Menampilkan pesan awal di LCD
  lcd.setCursor(0, 0);
  lcd.print("Silahkan hubungkan");
  lcd.setCursor(0, 1);
  lcd.print("WiFi...");

  // Menggunakan WiFi Manager untuk koneksi WiFi
  WiFiManager wifiManager;
  wifiManager.autoConnect("AutoConnectAP"); // Membuat AP jika tidak ada koneksi

  // Menampilkan pesan connecting
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Connecting...");

  // Tunggu beberapa detik untuk menunjukkan pesan
  delay(2000);

  // Menampilkan pesan berhasil menghubungkan ke Ubidots
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Menghubungkan ke");
  lcd.setCursor(0, 1);
  lcd.print("Ubidots...");

  // Inisialisasi Ubidots
  client.setDebug(true);  // Enable debug messages
  client.begin(callback);

  // Tunggu beberapa detik untuk menunjukkan pesan
  delay(2000);

  // Menampilkan pesan berhasil
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Berhasil terhubung");
  lcd.setCursor(0, 1);
  lcd.print("ke Ubidots");

  // Tunggu beberapa detik sebelum mulai membaca sensor
  delay(2000);

  // Inisialisasi sensor TCS34725
  if (tcs.begin()) {
    Serial.println("Found TCS34725 sensor");
  } else {
    Serial.println("No TCS34725 sensor found");
    while (1);
  }

  // Bersihkan LCD untuk tampilan sensor
  lcd.clear();
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

  // Read TDS value
  int tdsValue = analogRead(tdsPin);
  float tdsVoltage = tdsValue * (3.3 / 4095.0);
  float tdsPPM = tdsVoltage * 1000; // Konversi ke PPM (ganti dengan rumus yang sesuai jika perlu)

  // Publish TDS value to Ubidots
  client.add("tds_value", tdsPPM);
  client.ubidotsPublish("tds_source");

  // Read color data from TCS34725
  uint16_t r_raw, g_raw, b_raw, c;
  tcs.getRawData(&r_raw, &g_raw, &b_raw, &c);
  
  // Find the maximum value for proper scaling
  uint16_t max_value = max(r_raw, max(g_raw, b_raw));
  
  // Scale RGB values to 0-255 range
  uint8_t r = scaleTo255(r_raw, max_value);
  uint8_t g = scaleTo255(g_raw, max_value);
  uint8_t b = scaleTo255(b_raw, max_value);

  // Publish color data to Ubidots (scaled values)
  client.add("red_value", r);
  client.add("green_value", g);
  client.add("blue_value", b);
  client.ubidotsPublish("color_source");

  // Print RGB values to serial monitor (both raw and scaled)
  Serial.print("Raw R: ");
  Serial.print(r_raw);
  Serial.print(" G: ");
  Serial.print(g_raw);
  Serial.print(" B: ");
  Serial.print(b_raw);
  Serial.print(" | Scaled R: ");
  Serial.print(r);
  Serial.print(" G: ");
  Serial.print(g);
  Serial.print(" B: ");
  Serial.println(b);

  // Menampilkan nilai turbidity, TDS, dan warna dominan di LCD
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Turbidity (NTU):");
  lcd.setCursor(0, 1);
  lcd.print(turbidityNTU);
  delay(1000); // Delay untuk pembacaan berikutnya

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("TDS (PPM):");
  lcd.setCursor(0, 1);
  lcd.print(tdsPPM);
  delay(1000); // Delay untuk pembacaan berikutnya

  // Menampilkan nilai RGB di LCD more compactly
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("R:");
  lcd.print(r);
  lcd.setCursor(8, 0);
  lcd.print("G:");
  lcd.print(g);
  lcd.setCursor(0, 1);
  lcd.print("B:");
  lcd.print(b);
  delay(2000);
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