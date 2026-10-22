// ignore: depend_on_referenced_packages
import 'dart:ui_web' as ui_web;
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
// ignore: depend_on_referenced_packages
import 'package:web/web.dart' as web;

bool _moneyViewRegistered = false;

Widget buildMoneyWebView() {
  const viewType = 'rupeeflow-money-frame';

  if (!_moneyViewRegistered) {
    ui_web.platformViewRegistry.registerViewFactory(
      viewType,
      (int viewId) {
        final iframe = web.HTMLIFrameElement()
          ..src = kDebugMode ? 'http://127.0.0.1:5178/' : '/money/index.html?t=${DateTime.now().millisecondsSinceEpoch}'
          ..style.border = 'none'
          ..style.width = '100%'
          ..style.height = '100%';
        return iframe;
      },
    );
    _moneyViewRegistered = true;
  }

  return const HtmlElementView(viewType: viewType);
}
