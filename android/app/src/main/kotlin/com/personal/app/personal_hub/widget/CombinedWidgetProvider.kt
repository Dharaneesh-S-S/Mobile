package com.personal.app.personal_hub.widget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.view.KeyEvent
import android.widget.RemoteViews
import com.personal.app.personal_hub.R

class CombinedWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        val prefs = context.getSharedPreferences("FlutterSharedPreferences", Context.MODE_PRIVATE)

        // Music data
        val title = prefs.getString("flutter.title", null)
            ?: prefs.getString("title", "Personal Hub Music")
        val artist = prefs.getString("flutter.artist", null)
            ?: prefs.getString("artist", "Tap to open player")
        val isPlaying = prefs.getBoolean("flutter.isPlaying", false)

        // Usage data
        val screenTime = prefs.getString("flutter.screenTime", null)
            ?: prefs.getString("screenTime", "0m")
        val topApp = prefs.getString("flutter.topApp", null)
            ?: prefs.getString("topApp", "No usage recorded yet")
        val usageStatus = prefs.getString("flutter.usageStatus", null)
            ?: prefs.getString("usageStatus", "Active")

        for (appWidgetId in appWidgetIds) {
            val views = RemoteViews(context.packageName, R.layout.widget_combined)

            // Music values
            views.setTextViewText(R.id.combined_widget_title, title)
            views.setTextViewText(R.id.combined_widget_artist, artist)
            if (isPlaying) {
                views.setImageViewResource(R.id.combined_widget_play_pause, R.drawable.ic_widget_pause)
            } else {
                views.setImageViewResource(R.id.combined_widget_play_pause, R.drawable.ic_widget_play)
            }

            // Usage values
            views.setTextViewText(R.id.combined_widget_screen_time, screenTime)
            views.setTextViewText(R.id.combined_widget_top_app, topApp)
            views.setTextViewText(R.id.combined_widget_usage_status, usageStatus)

            // App Launch Intent
            val launchIntent = context.packageManager.getLaunchIntentForPackage(context.packageName)
            if (launchIntent != null) {
                launchIntent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
                val launchPending = PendingIntent.getActivity(
                    context,
                    301,
                    launchIntent,
                    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                )
                views.setOnClickPendingIntent(R.id.combined_usage_section, launchPending)
                views.setOnClickPendingIntent(R.id.combined_widget_art, launchPending)
            }

            // Media Controls routed to MediaButtonReceiver
            val mediaReceiver = ComponentName(context, "com.ryanheise.audioservice.MediaButtonReceiver")

            // Previous
            val prevIntent = Intent(Intent.ACTION_MEDIA_BUTTON).apply {
                component = mediaReceiver
                putExtra(Intent.EXTRA_KEY_EVENT, KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_PREVIOUS))
            }
            val prevPending = PendingIntent.getBroadcast(
                context,
                302,
                prevIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.combined_widget_prev, prevPending)

            // Play / Pause
            val playPauseIntent = Intent(Intent.ACTION_MEDIA_BUTTON).apply {
                component = mediaReceiver
                putExtra(Intent.EXTRA_KEY_EVENT, KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_PLAY_PAUSE))
            }
            val playPausePending = PendingIntent.getBroadcast(
                context,
                303,
                playPauseIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.combined_widget_play_pause, playPausePending)

            // Next
            val nextIntent = Intent(Intent.ACTION_MEDIA_BUTTON).apply {
                component = mediaReceiver
                putExtra(Intent.EXTRA_KEY_EVENT, KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_NEXT))
            }
            val nextPending = PendingIntent.getBroadcast(
                context,
                304,
                nextIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.combined_widget_next, nextPending)

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }

    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)
        if (intent.action == AppWidgetManager.ACTION_APPWIDGET_UPDATE ||
            intent.action == "es.antonborri.home_widget.action.UPDATE") {
            val appWidgetManager = AppWidgetManager.getInstance(context)
            val thisWidget = ComponentName(context, CombinedWidgetProvider::class.java)
            val appWidgetIds = appWidgetManager.getAppWidgetIds(thisWidget)
            if (appWidgetIds != null && appWidgetIds.isNotEmpty()) {
                onUpdate(context, appWidgetManager, appWidgetIds)
            }
        }
    }
}
