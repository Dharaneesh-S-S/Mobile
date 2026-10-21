import 'dart:ui_web' as ui_web;
import 'package:flutter/material.dart';
import 'package:web/web.dart' as web;

bool _tasksViewRegistered = false;

Widget buildTasksWebView() {
  const viewType = 'zenith-tasks-frame';

  if (!_tasksViewRegistered) {
    ui_web.platformViewRegistry.registerViewFactory(
      viewType,
      (int viewId) {
        final iframe = web.HTMLIFrameElement()
          ..src = '/tasks/index.html'
          ..style.border = 'none'
          ..style.width = '100%'
          ..style.height = '100%';
        return iframe;
      },
    );
    _tasksViewRegistered = true;
  }

  return const HtmlElementView(viewType: viewType);
}
