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

class MusicWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        val prefs = context.getSharedPreferences("FlutterSharedPreferences", Context.MODE_PRIVATE)

        // Read stored data saved via HomeWidget in Flutter
        val title = prefs.getString("flutter.title", null) 
            ?: prefs.getString("title", "Personal Hub Music")
        val artist = prefs.getString("flutter.artist", null) 
            ?: prefs.getString("artist", "Tap to open player")
        val isPlaying = prefs.getBoolean("flutter.isPlaying", false)

        for (appWidgetId in appWidgetIds) {
            val views = RemoteViews(context.packageName, R.layout.widget_music)

            views.setTextViewText(R.id.widget_title, title)
            views.setTextViewText(R.id.widget_artist, artist)

            if (isPlaying) {
                views.setImageViewResource(R.id.widget_play_pause, R.drawable.ic_widget_pause)
            } else {
                views.setImageViewResource(R.id.widget_play_pause, R.drawable.ic_widget_play)
            }

            // Launch App on clicking widget body
            val launchIntent = context.packageManager.getLaunchIntentForPackage(context.packageName)
            if (launchIntent != null) {
                val launchPendingIntent = PendingIntent.getActivity(
                    context,
                    0,
                    launchIntent,
                    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                )
                views.setOnClickPendingIntent(R.id.widget_container, launchPendingIntent)
            }

            // Media Controls routed directly to MediaButtonReceiver (operates even when app UI is closed)
            val mediaReceiver = ComponentName(context, "com.ryanheise.audioservice.MediaButtonReceiver")

            // Previous
            val prevIntent = Intent(Intent.ACTION_MEDIA_BUTTON).apply {
                component = mediaReceiver
                putExtra(Intent.EXTRA_KEY_EVENT, KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_PREVIOUS))
            }
            val prevPending = PendingIntent.getBroadcast(
                context,
                101,
                prevIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.widget_prev, prevPending)

            // Play / Pause
            val playPauseIntent = Intent(Intent.ACTION_MEDIA_BUTTON).apply {
                component = mediaReceiver
                putExtra(Intent.EXTRA_KEY_EVENT, KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_PLAY_PAUSE))
            }
            val playPausePending = PendingIntent.getBroadcast(
                context,
                102,
                playPauseIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.widget_play_pause, playPausePending)

            // Next
            val nextIntent = Intent(Intent.ACTION_MEDIA_BUTTON).apply {
                component = mediaReceiver
                putExtra(Intent.EXTRA_KEY_EVENT, KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_NEXT))
            }
            val nextPending = PendingIntent.getBroadcast(
                context,
                103,
                nextIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.widget_next, nextPending)

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }

    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)
        if (intent.action == AppWidgetManager.ACTION_APPWIDGET_UPDATE ||
            intent.action == "es.antonborri.home_widget.action.UPDATE") {
            val appWidgetManager = AppWidgetManager.getInstance(context)
            val thisWidget = ComponentName(context, MusicWidgetProvider::class.java)
            val appWidgetIds = appWidgetManager.getAppWidgetIds(thisWidget)
            if (appWidgetIds != null && appWidgetIds.isNotEmpty()) {
                onUpdate(context, appWidgetManager, appWidgetIds)
            }
        }
    }
}
