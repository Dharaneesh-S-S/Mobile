import 'package:flutter/material.dart';
import 'tasks_web_view_stub.dart'
    if (dart.library.js_interop) 'tasks_web_view_web.dart' as web_impl;

class ZenithTasksWebView extends StatelessWidget {
  const ZenithTasksWebView({super.key});

  @override
  Widget build(BuildContext context) {
    return web_impl.buildTasksWebView();
  }
}
