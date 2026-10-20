import 'dart:ui_web' as ui_web;
import 'package:flutter/material.dart';
import 'package:web/web.dart' as web;

bool _calendarViewRegistered = false;

Widget buildCalendarWebView() {
  const viewType = 'chronos-calendar-frame';

  if (!_calendarViewRegistered) {
    ui_web.platformViewRegistry.registerViewFactory(
      viewType,
      (int viewId) {
        final iframe = web.HTMLIFrameElement()
          ..src = '/calendar/index.html'
          ..style.border = 'none'
          ..style.width = '100%'
          ..style.height = '100%';
        return iframe;
      },
    );
    _calendarViewRegistered = true;
  }

  return const HtmlElementView(viewType: viewType);
}
