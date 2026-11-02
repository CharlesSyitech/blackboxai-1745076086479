import 'package:cgescar_core/cgescar_core.dart';
import 'package:flutter/material.dart';

import '../../core/services.dart';
import 'take_fuel_screen.dart';

/// Fidélité : Mes cartes | Stats | Mes reçus (§5.6).
class LoyaltyTab extends StatelessWidget {
  const LoyaltyTab({super.key});

  @override
  Widget build(BuildContext context) => DefaultTabController(
        length: 3,
        child: Scaffold(
          appBar: AppBar(
            title: const Text('Fidélité'),
            bottom: const TabBar(tabs: [
              Tab(text: 'Mes cartes'),
              Tab(text: 'Stats'),
              Tab(text: 'Mes reçus'),
            ]),
          ),
          body: const TabBarView(children: [_Cards(), _Stats(), _Receipts()]),
        ),
      );
}

class _Cards extends StatefulWidget {
  const _Cards();
  @override
  State<_Cards> createState() => _CardsState();
}

class _CardsState extends State<_Cards> {
  late Future<List<Map<String, dynamic>>> _cards;
  int _selected = 0;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final c = Services.of(context).session.client;
    _cards = c
        .from('loyalty_cards')
        .select('id, points, tier, oil_companies(name, logo_url)')
        .then((r) => List<Map<String, dynamic>>.from(r));
  }

  Future<void> _takeFuel() async {
    final client = Services.of(context).session.client;
    final vehicles = List<Map<String, dynamic>>.from(
        await client.from('user_vehicles').select('id, plate'));
    if (!mounted) return;
    if (vehicles.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text('Ajoutez d\'abord un véhicule (immatriculation) dans Mon espace.')));
      return;
    }
    final v = vehicles.length == 1
        ? vehicles.first
        : await showModalBottomSheet<Map<String, dynamic>>(
            context: context,
            builder: (ctx) => ListView(shrinkWrap: true, children: [
              for (final v in vehicles)
                ListTile(
                  leading: const Icon(Icons.directions_car),
                  title: Text('${v['plate']}'),
                  onTap: () => Navigator.pop(ctx, v),
                ),
            ]),
          );
    if (v == null || !mounted) return;
    await Navigator.of(context).push(MaterialPageRoute(
        builder: (_) => TakeFuelScreen(vehicleId: '${v['id']}', vehicleLabel: '${v['plate']}')));
  }

  @override
  Widget build(BuildContext context) => FutureBuilder(
        future: _cards,
        builder: (context, snap) {
          if (snap.hasError) return Center(child: Text('${snap.error}'));
          if (!snap.hasData) return const Center(child: CircularProgressIndicator());
          final cards = snap.data!;
          final card = cards.isEmpty ? null : cards[_selected.clamp(0, cards.length - 1)];
          final points = (card?['points'] as num?)?.toInt() ?? 0;
          final company = card?['oil_companies'] as Map?;
          return ListView(padding: const EdgeInsets.all(16), children: [
            // Sélecteur compagnie toujours visible, même avec une seule carte.
            SizedBox(
              height: 56,
              child: ListView(scrollDirection: Axis.horizontal, children: [
                for (var i = 0; i < cards.length; i++)
                  Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ChoiceChip(
                      selected: i == _selected,
                      onSelected: (_) => setState(() => _selected = i),
                      label: Text('${(cards[i]['oil_companies'] as Map?)?['name'] ?? 'C-GESCAR'} · ${cards[i]['points'] ?? 0} pts'),
                    ),
                  ),
                if (cards.isEmpty) const Chip(label: Text('C-GESCAR · 0 pts')),
              ]),
            ),
            const SizedBox(height: 12),
            LoyaltyCardView(
              companyName: '${company?['name'] ?? 'C-GESCAR'}',
              points: points,
              tier: '${card?['tier'] ?? 'silver'}',
            ),
            const SizedBox(height: 12),
            if (points == 0)
              const Text(
                'Bienvenue ! Votre carte Argent est active avec 0 point. Faites scanner votre QR lors de votre plein : 1 litre = 1 point, carte Or puis Diamant ensuite.',
                textAlign: TextAlign.center,
              ),
            const SizedBox(height: 16),
            FilledButton.icon(
              onPressed: _takeFuel,
              icon: const Icon(Icons.qr_code_2),
              label: const Text('Prendre carburant'),
            ),
          ]);
        },
      );
}

class LoyaltyCardView extends StatelessWidget {
  final String companyName;
  final int points;
  final String tier;
  const LoyaltyCardView({super.key, required this.companyName, required this.points, required this.tier});

  @override
  Widget build(BuildContext context) {
    final (label, colors) = switch (tier) {
      'gold' => ('Or', const [Color(0xFFB8860B), Color(0xFFFFD86B)]),
      'diamond' => ('Diamant', const [Color(0xFF3A6EA5), Color(0xFFB9E6FF)]),
      _ => ('Argent', const [Color(0xFF6E7B8B), Color(0xFFD9DEE4)]),
    };
    return AspectRatio(
      aspectRatio: 1.586, // format carte bancaire
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          gradient: LinearGradient(colors: colors, begin: Alignment.topLeft, end: Alignment.bottomRight),
        ),
        padding: const EdgeInsets.all(20),
        child: DefaultTextStyle(
          style: const TextStyle(color: Colors.white),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(companyName, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w700)),
            const Spacer(),
            Text('${formatNumber(points)} points',
                style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w800)),
            Text('Carte $label', style: const TextStyle(fontSize: 16)),
          ]),
        ),
      ),
    );
  }
}

class _Stats extends StatelessWidget {
  const _Stats();
  @override
  Widget build(BuildContext context) => FutureBuilder(
        future: Services.of(context).api.loyaltyMyTakes(),
        builder: (context, snap) {
          if (snap.hasError) return Center(child: Text('${snap.error}'));
          if (!snap.hasData) return const Center(child: CircularProgressIndicator());
          final takes = snap.data!.cast<Map>().where((t) => t['cancelled_at'] == null).toList();
          if (takes.isEmpty) return const Center(child: Text('Aucune prise pour l\'instant'));
          final litres = takes.fold<double>(0, (a, t) => a + ((t['litres'] as num?) ?? 0));
          final amount = takes.fold<double>(0, (a, t) => a + ((t['amount'] as num?) ?? 0));
          final pts = takes.fold<int>(0, (a, t) => a + ((t['points'] as num?)?.toInt() ?? 0));
          Widget kpi(String l, String v) => Card(
              child: ListTile(title: Text(l), trailing: Text(v, style: Theme.of(context).textTheme.titleMedium)));
          return ListView(padding: const EdgeInsets.all(16), children: [
            kpi('Litres', formatLitres(litres)),
            kpi('Montant', formatFcfa(amount)),
            kpi('Nombre de prises', '${takes.length}'),
            kpi('Moyenne par prise', formatLitres(litres / takes.length)),
            kpi('Points', formatNumber(pts)),
          ]);
        },
      );
}

class _Receipts extends StatelessWidget {
  const _Receipts();
  @override
  Widget build(BuildContext context) => FutureBuilder(
        future: Services.of(context).api.loyaltyMyTakes(),
        builder: (context, snap) {
          if (snap.hasError) return Center(child: Text('${snap.error}'));
          if (!snap.hasData) return const Center(child: CircularProgressIndicator());
          final takes = snap.data!.cast<Map>();
          if (takes.isEmpty) return const Center(child: Text('Aucune prise pour l\'instant'));
          return ListView.separated(
            itemCount: takes.length,
            separatorBuilder: (_, __) => const Divider(height: 1),
            itemBuilder: (_, i) {
              final t = takes[i];
              final cancelled = t['cancelled_at'] != null;
              return ListTile(
                title: Text('${t['station_name'] ?? ''} · ${t['product_name'] ?? ''}'),
                subtitle: Text(t['created_at'] == null
                    ? ''
                    : formatDateTime(DateTime.parse('${t['created_at']}').toLocal())),
                trailing: Text(cancelled
                    ? 'ANNULÉ'
                    : '${formatLitres((t['litres'] as num?) ?? 0)}\n+${t['points'] ?? 0} pts',
                    textAlign: TextAlign.end),
              );
            },
          );
        },
      );
}
