import 'package:flutter/material.dart';
import 'calendar_web_view_stub.dart'
    if (dart.library.js_interop) 'calendar_web_view_web.dart' as web_impl;

class ChronosCalendarWebView extends StatelessWidget {
  const ChronosCalendarWebView({super.key});

  @override
  Widget build(BuildContext context) {
    return web_impl.buildCalendarWebView();
  }
}
