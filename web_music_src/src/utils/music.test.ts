import { describe, it, expect } from 'vitest'
import { parseFilenameMetadata, parseLrcLyrics } from '../db/id3Parser'
import { formatDuration } from './formatters'
import { evaluateSmartRule, filterTracksBySmartRules } from './smartPlaylistRules'
import { Track, Playlist, SmartRule } from '../types/music'

describe('Music Player Unit Tests', () => {
  describe('Filename Metadata Parser Fallbacks', () => {
    it('parses "Artist - Title.mp3"', () => {
      const res = parseFilenameMetadata('Daft Punk - Get Lucky.mp3')
      expect(res.artist).toBe('Daft Punk')
      expect(res.title).toBe('Get Lucky')
    })

    it('parses numbered track "04. Queen - Bohemian Rhapsody.flac"', () => {
      const res = parseFilenameMetadata('04. Queen - Bohemian Rhapsody.flac')
      expect(res.trackNo).toBe(4)
      expect(res.artist).toBe('Queen')
      expect(res.title).toBe('Bohemian Rhapsody')
    })

    it('handles standalone title "Stairway to Heaven.wav"', () => {
      const res = parseFilenameMetadata('Stairway to Heaven.wav')
      expect(res.title).toBe('Stairway to Heaven')
      expect(res.artist).toBe('Unknown Artist')
    })
  })

  describe('Synced LRC Lyrics Parser', () => {
    it('parses standard [mm:ss.xx] timestamped lines', () => {
      const sampleLrc = `[00:02.50] First line of the song
[00:08.00] Second verse follows
[01:14.20] Chorus drops here`

      const lines = parseLrcLyrics(sampleLrc)
      expect(lines.length).toBe(3)
      expect(lines[0].time).toBeCloseTo(2.5, 1)
      expect(lines[0].text).toBe('First line of the song')
      expect(lines[1].time).toBeCloseTo(8.0, 1)
      expect(lines[2].time).toBeCloseTo(74.2, 1)
      expect(lines[2].text).toBe('Chorus drops here')
    })

    it('handles empty or plain text gracefully', () => {
      expect(parseLrcLyrics('')).toEqual([])
      expect(parseLrcLyrics('Plain text without timestamps')).toEqual([])
    })
  })

  describe('Duration Formatter', () => {
    it('formats minutes and seconds correctly', () => {
      expect(formatDuration(0)).toBe('0:00')
      expect(formatDuration(65)).toBe('1:05')
      expect(formatDuration(234)).toBe('3:54')
      expect(formatDuration(3665)).toBe('1:01:05')
    })
  })

  describe('Smart Playlist Rule Evaluation', () => {
    const mockTrack: Track = {
      id: 't1',
      title: 'Midnight City',
      artist: 'M83',
      album: 'Hurry Up, We\'re Dreaming',
      genre: 'Electronic',
      year: 2011,
      duration: 244,
      playCount: 42,
      isFavorite: true,
      filePath: 'M83 - Midnight City.mp3',
      fileName: 'Midnight City.mp3',
      fileSize: 8000000,
      fileFormat: 'mp3',
      dateAdded: new Date(Date.now() - 5 * 86400000).toISOString(),
    }

    it('evaluates genre contains rule', () => {
      const rule: SmartRule = { id: '1', field: 'genre', operator: 'contains', value: 'Electr' }
      expect(evaluateSmartRule(mockTrack, rule)).toBe(true)
    })

    it('evaluates year between rule', () => {
      const ruleMatch: SmartRule = { id: '2', field: 'year', operator: 'between', value: 2010, secondValue: 2015 }
      const ruleFail: SmartRule = { id: '3', field: 'year', operator: 'between', value: 1990, secondValue: 1999 }
      expect(evaluateSmartRule(mockTrack, ruleMatch)).toBe(true)
      expect(evaluateSmartRule(mockTrack, ruleFail)).toBe(false)
    })

    it('evaluates playCount greaterThan rule', () => {
      const rule: SmartRule = { id: '4', field: 'playCount', operator: 'greaterThan', value: 20 }
      expect(evaluateSmartRule(mockTrack, rule)).toBe(true)
    })

    it('evaluates dateAddedDays lessThan (recent tracks)', () => {
      const rule: SmartRule = { id: '5', field: 'dateAddedDays', operator: 'lessThan', value: 7 }
      expect(evaluateSmartRule(mockTrack, rule)).toBe(true)
    })

    it('filters collection using AND (mode all)', () => {
      const playlist: Playlist = {
        id: 'pl-smart',
        name: 'Top Electronic',
        trackIds: [],
        createdAt: '',
        updatedAt: '',
        isSmart: true,
        smartMatchMode: 'all',
        smartRules: [
          { id: 'r1', field: 'genre', operator: 'contains', value: 'Electronic' },
          { id: 'r2', field: 'playCount', operator: 'greaterThan', value: 10 },
        ],
      }

      const otherTrack: Track = { ...mockTrack, id: 't2', genre: 'Acoustic' }
      const result = filterTracksBySmartRules([mockTrack, otherTrack], playlist)
      expect(result.length).toBe(1)
      expect(result[0].id).toBe('t1')
    })
  })
})
