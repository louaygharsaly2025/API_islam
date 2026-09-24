// ============================================================================
// Real Printed Mushaf Viewer Component for Flutter
// Supports: Hafs, Warsh, Qaloon, Tajweed, Page-Flipping, Juz & Surah Headers
// ============================================================================

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class MushafReaderScreen extends StatefulWidget {
  final int initialPage;
  final String edition; // 'quran-hafs-madinah', 'quran-warsh-madinah', 'quran-qaloon-madinah', 'quran-tajweed-color'

  const MushafReaderScreen({
    Key? key,
    this.initialPage = 1,
    this.edition = 'quran-hafs-madinah',
  }) : super(key: key);

  @override
  State<MushafReaderScreen> createState() => _MushafReaderScreenState();
}

class _MushafReaderScreenState extends State<MushafReaderScreen> {
  late PageController _pageController;
  late int _currentPage;
  late String _currentEdition;
  Map<String, dynamic>? _pageData;
  bool _isLoading = false;

  final String _apiBase = "http://localhost:8000/api/v1";

  @override
  void initState() {
    super.initState();
    _currentPage = widget.initialPage;
    _currentEdition = widget.edition;
    _pageController = PageController(initialPage: _currentPage - 1);
    _loadPageMeta(_currentPage);
  }

  Future<void> _loadPageMeta(int page) async {
    setState(() => _isLoading = true);
    try {
      final res = await http.get(Uri.parse('$_apiBase/mushaf/page/$page?edition=$_currentEdition'));
      if (res.statusCode == 200) {
        setState(() {
          _pageData = jsonDecode(utf8.decode(res.bodyBytes));
        });
      }
    } catch (e) {
      debugPrint("Error loading page: $e");
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFBF7EE), // Traditional Mushaf Paper Warm Cream Color
      appBar: AppBar(
        backgroundColor: const Color(0xFF1B3B2B), // Islamic Deep Green
        foregroundColor: Colors.white,
        title: Text(
          _pageData != null
              ? 'سورة ${_pageData!['location']['surah_name_ar']} | الجزء ${_pageData!['location']['juz']}'
              : 'المصحف الشريف',
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        actions: [
          // Riwayah Switcher Dropdown
          DropdownButton<String>(
            value: _currentEdition,
            dropdownColor: const Color(0xFF1B3B2B),
            style: const TextStyle(color: Colors.white),
            underline: const SizedBox(),
            items: const [
              DropdownMenuItem(value: 'quran-hafs-madinah', child: Text('حفص عن عاصم')),
              DropdownMenuItem(value: 'quran-tajweed-color', child: Text('التجويد الملون')),
              DropdownMenuItem(value: 'quran-warsh-madinah', child: Text('ورش عن نافع')),
              DropdownMenuItem(value: 'quran-qaloon-madinah', child: Text('قالون عن نافع')),
              DropdownMenuItem(value: 'quran-shamerly', child: Text('مصحف الشمرلي')),
            ],
            onChanged: (val) {
              if (val != null) {
                setState(() => _currentEdition = val);
                _loadPageMeta(_currentPage);
              }
            },
          ),
        ],
      ),
      body: PageView.builder(
        controller: _pageController,
        itemCount: 604,
        reverse: true, // Right-to-Left book reading flow!
        onPageChanged: (idx) {
          final newPage = idx + 1;
          setState(() => _currentPage = newPage);
          _loadPageMeta(newPage);
        },
        itemBuilder: (context, index) {
          final pageNumber = index + 1;
          final imageUrl = _pageData?['media']['image_url'] ??
              'https://raw.githubusercontent.com/TheGreatMage/quran-pages-images/master/pages/$pageNumber.png';

          return Container(
            margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(8),
              boxShadow: const [
                BoxShadow(color: Colors.black12, blurRadius: 8, spreadRadius: 2),
              ],
            ),
            child: Column(
              children: [
                // Top Header: Surah & Juz
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        _pageData != null ? 'الجزء ${_pageData!['location']['juz']}' : '',
                        style: const TextStyle(color: Colors.brown, fontWeight: FontWeight.bold),
                      ),
                      Text(
                        _pageData != null ? 'سورة ${_pageData!['location']['surah_name_ar']}' : '',
                        style: const TextStyle(color: Colors.brown, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ),
                const Divider(height: 1, color: Color(0xFFD4AF37)), // Gold border

                // Mushaf High-Res Page
                Expanded(
                  child: Image.network(
                    imageUrl,
                    fit: BoxFit.contain,
                    loadingBuilder: (ctx, child, progress) {
                      if (progress == null) return child;
                      return const Center(child: CircularProgressIndicator());
                    },
                  ),
                ),

                // Bottom Page Number
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Text(
                    '$pageNumber',
                    style: const TextStyle(color: Colors.brown, fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
