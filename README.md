# Deen Daily (v2.0.1)

Your daily guide to Deen — a modern Expo app that brings prayer times, Quran, hadith, fasting, and zakat tools into one clean, consistent experience.

## Highlights

- Prayer times with location support, next-prayer countdown, and qibla direction.
- Quran browsing with surah details, translations and audio streaming.
- Hadith browsing, search, and chapters.
- Fasting cards (sahur/iftar) and white days.
- Zakat nisab info and calculator.
- Asma-ul Husna (name of the day + full list).
- Consistent theming with shared palette, typography, and card styles.

## Screenshots (v2.0.1)

<table>
	<tr>
		<td><img src="assets/images/v200-ss/01.jpg" alt="Screenshot 01" width="280" /></td>
		<td><img src="assets/images/v200-ss/02.jpg" alt="Screenshot 02" width="280" /></td>
	</tr>
	<tr>
		<td><img src="assets/images/v200-ss/03.jpg" alt="Screenshot 03" width="280" /></td>
		<td><img src="assets/images/v200-ss/04.jpg" alt="Screenshot 04" width="280" /></td>
	</tr>
	<tr>
		<td><img src="assets/images/v200-ss/05.jpg" alt="Screenshot 05" width="280" /></td>
		<td><img src="assets/images/v200-ss/06.jpg" alt="Screenshot 06" width="280" /></td>
	</tr>
	<tr>
		<td><img src="assets/images/v200-ss/07.jpg" alt="Screenshot 07" width="280" /></td>
		<td><img src="assets/images/v200-ss/08.jpg" alt="Screenshot 08" width="280" /></td>
	</tr>
</table>

## Tech stack

- Expo (React Native)
- Expo Router
- React Query
- TypeScript
- Bun runtime

## Getting started

1) Install dependencies:

```bash
bun install
```

2) Start the app:

```bash
bun run start
```

3) Run on Android (optional):

```bash
bun run android
```

### Android prebuild & run

If you need to regenerate native Android projects:

```bash
bunx expo prebuild --platform android
```

Run the Android app:

```bash
bunx expo run:android
```

## Project structure

- `app/` — screens and routes (Expo Router)
- `components/` — UI components by domain
- `lib/api/` — API fetchers
- `lib/storage/` — local storage helpers
- `constants/` — theme tokens and settings

## Credits

This project uses the following APIs:

- Islamic API — https://islamicapi.com/
- Hadith API — https://hadithapi.com/
- AlQuran API — https://alquran-api.pages.dev/

## Developer

- Project repo: https://github.com/Tahsin005/deen-daily
- GitHub: https://github.com/Tahsin005/
- LinkedIn: https://www.linkedin.com/in/md-tahsin-ferdous/