import 'package:flutter/material.dart';
import 'notes_web_view_stub.dart'
    if (dart.library.js_interop) 'notes_web_view_web.dart' as web_impl;

/// AuraNotesWebView renders the full AuraNotes Quick-Capture & Document Studio
class AuraNotesWebView extends StatelessWidget {
  const AuraNotesWebView({super.key});

  @override
  Widget build(BuildContext context) {
    return web_impl.buildNotesWebView();
  }
}
