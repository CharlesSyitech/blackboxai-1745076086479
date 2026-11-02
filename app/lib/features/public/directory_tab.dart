import 'package:flutter/material.dart';

import '../../core/services.dart';

/// Annuaire des stations avec filtre par compagnie, tuile « Tout » en
/// tête (§5.2). Logos toujours en couleur.
class DirectoryTab extends StatefulWidget {
  const DirectoryTab({super.key});

  @override
  State<DirectoryTab> createState() => _DirectoryTabState();
}

class _DirectoryTabState extends State<DirectoryTab> {
  late Future<(List<dynamic>, List<dynamic>)> _data;
  String? _company; // null = « Tout »
  String _query = '';

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final api = Services.of(context).api;
    _data = Future.wait([api.publicNetworkStations(), api.publicOilCompanies()])
        .then((r) => (r[0], r[1]));
  }

  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('Annuaire')),
        body: FutureBuilder(
          future: _data,
          builder: (context, snap) {
            if (snap.hasError) return Center(child: Text('${snap.error}'));
            if (!snap.hasData) return const Center(child: CircularProgressIndicator());
            final (stations, companies) = snap.data!;
            final q = _query.toLowerCase();
            final filtered = stations.where((s) {
              final m = s as Map;
              if (_company != null && '${m['oil_company_id']}' != _company) return false;
              if (q.isEmpty) return true;
              return '${m['name']} ${m['city']}'.toLowerCase().contains(q);
            }).toList();
            return Column(children: [
              Padding(
                padding: const EdgeInsets.all(12),
                child: TextField(
                  decoration: const InputDecoration(
                      prefixIcon: Icon(Icons.search), hintText: 'Ville ou nom de station'),
                  onChanged: (v) => setState(() => _query = v),
                ),
              ),
              SizedBox(
                height: 84,
                child: ListView(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 8),
                  children: [
                    _tile(label: 'Tout', selected: _company == null, onTap: () => setState(() => _company = null)),
                    for (final c in companies.cast<Map>())
                      _tile(
                        label: '${c['name']}',
                        logo: c['logo_url'] as String?,
                        selected: _company == '${c['id']}',
                        onTap: () => setState(() => _company = '${c['id']}'),
                      ),
                  ],
                ),
              ),
              Expanded(
                child: filtered.isEmpty
                    ? const Center(child: Text('Aucune station'))
                    : ListView.builder(
                        itemCount: filtered.length,
                        itemBuilder: (_, i) {
                          final s = filtered[i] as Map;
                          return ListTile(
                            leading: _logo(s['oil_company_logo'] as String?),
                            title: Text('${s['name']}'),
                            subtitle: Text([s['address'], s['city']].whereType<String>().join(', ')),
                          );
                        },
                      ),
              ),
            ]);
          },
        ),
      );

  Widget _logo(String? url, {double size = 36}) => url == null
      ? Icon(Icons.local_gas_station, size: size)
      : Image.network(url, width: size, height: size,
          errorBuilder: (_, __, ___) => Icon(Icons.local_gas_station, size: size));

  Widget _tile({required String label, String? logo, required bool selected, required VoidCallback onTap}) {
    final cs = Theme.of(context).colorScheme;
    return Padding(
      padding: const EdgeInsets.all(4),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          width: 76,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: selected ? cs.secondary : cs.outlineVariant, width: selected ? 2 : 1),
          ),
          padding: const EdgeInsets.all(6),
          child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
            logo == null ? const Icon(Icons.apps) : _logo(logo, size: 32),
            const SizedBox(height: 4),
            Text(label, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 11)),
          ]),
        ),
      ),
    );
  }
}
