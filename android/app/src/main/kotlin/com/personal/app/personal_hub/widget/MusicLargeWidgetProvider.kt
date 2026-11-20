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

class MusicLargeWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        val prefs = context.getSharedPreferences("FlutterSharedPreferences", Context.MODE_PRIVATE)

        val title = prefs.getString("flutter.title", null)
            ?: prefs.getString("title", "Personal Music")
        val artist = prefs.getString("flutter.artist", null)
            ?: prefs.getString("artist", "Tap to open player")
        val album = prefs.getString("flutter.album", null)
            ?: prefs.getString("album", "")
        val isPlaying = prefs.getBoolean("flutter.isPlaying", false)
        val progress = prefs.getInt("flutter.progressPercent", 0)

        for (appWidgetId in appWidgetIds) {
            val views = RemoteViews(context.packageName, R.layout.widget_music_large)

            views.setTextViewText(R.id.widget_title, title)
            views.setTextViewText(R.id.widget_artist, artist)
            views.setTextViewText(R.id.widget_album, album)
            views.setProgressBar(R.id.widget_progress, 100, progress.coerceIn(0, 100), false)

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

            val mediaReceiver = ComponentName(context, "com.ryanheise.audioservice.MediaButtonReceiver")

            // Previous
            val prevIntent = Intent(Intent.ACTION_MEDIA_BUTTON).apply {
                component = mediaReceiver
                putExtra(Intent.EXTRA_KEY_EVENT, KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_PREVIOUS))
            }
            val prevPending = PendingIntent.getBroadcast(
                context,
                301,
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
                302,
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
                303,
                nextIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.widget_next, nextPending)

            // Shuffle Button click toggles via broadcast
            val shuffleIntent = Intent(Intent.ACTION_MEDIA_BUTTON).apply {
                component = mediaReceiver
                putExtra(Intent.EXTRA_KEY_EVENT, KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_FAST_FORWARD))
            }
            val shufflePending = PendingIntent.getBroadcast(
                context,
                304,
                shuffleIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.widget_shuffle, shufflePending)

            // Repeat Button click toggles via broadcast
            val repeatIntent = Intent(Intent.ACTION_MEDIA_BUTTON).apply {
                component = mediaReceiver
                putExtra(Intent.EXTRA_KEY_EVENT, KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_MEDIA_REWIND))
            }
            val repeatPending = PendingIntent.getBroadcast(
                context,
                305,
                repeatIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.widget_repeat, repeatPending)

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }

    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)
        if (intent.action == AppWidgetManager.ACTION_APPWIDGET_UPDATE ||
            intent.action == "es.antonborri.home_widget.action.UPDATE") {
            val appWidgetManager = AppWidgetManager.getInstance(context)
            val thisWidget = ComponentName(context, MusicLargeWidgetProvider::class.java)
            val appWidgetIds = appWidgetManager.getAppWidgetIds(thisWidget)
            if (appWidgetIds != null && appWidgetIds.isNotEmpty()) {
                onUpdate(context, appWidgetManager, appWidgetIds)
            }
        }
    }
}
