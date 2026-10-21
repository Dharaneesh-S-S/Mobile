import 'package:flutter/material.dart';
import 'music_web_view_stub.dart'
    if (dart.library.js_interop) 'music_web_view_web.dart' as web_impl;

/// AuraBeatMusicWebView renders the full on-device AuraBeat Music Player Studio
class AuraBeatMusicWebView extends StatelessWidget {
  const AuraBeatMusicWebView({super.key});

  @override
  Widget build(BuildContext context) {
    return web_impl.buildMusicWebView();
  }
}
