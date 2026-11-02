import 'package:cgescar_core/cgescar_core.dart';
import 'package:flutter/material.dart';

import '../../core/services.dart';
import '../../ui/widgets/common.dart';

/// Accueil grand public : prix du marché uniques (§5.1).
class HomeTab extends StatefulWidget {
  const HomeTab({super.key});

  @override
  State<HomeTab> createState() => _HomeTabState();
}

class _HomeTabState extends State<HomeTab> {
  late Future<List<Map<String, dynamic>>> _prices;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _prices = Services.of(context).api.latestMarketPrices();
  }

  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('Prix du marché')),
        body: FutureBuilder(
          future: _prices,
          builder: (context, snap) {
            if (snap.hasError) return Center(child: Text('${snap.error}'));
            if (!snap.hasData) return const Center(child: CircularProgressIndicator());
            // Un seul prix publié par produit : on garde le plus récent.
            final latest = <String, Map<String, dynamic>>{};
            for (final r in snap.data!) {
              latest.putIfAbsent('${r['product_name'] ?? r['product_id']}', () => r);
            }
            if (latest.isEmpty) {
              return const Center(child: Text('Aucun prix publié pour l\'instant'));
            }
            return ListView(
              padding: const EdgeInsets.all(16),
              children: [
                for (final e in latest.entries)
                  Card(
                    child: ListTile(
                      leading: ProductDot(name: e.key, size: 20),
                      title: Text(e.key, style: const TextStyle(fontWeight: FontWeight.w700)),
                      subtitle: Text([
                        if (e.value['effective_date'] != null)
                          formatDate(DateTime.parse('${e.value['effective_date']}')),
                        if (e.value['source'] != null) '${e.value['source']}',
                      ].join(' · ')),
                      trailing: Text(
                        formatFcfa((e.value['price'] as num?) ?? 0),
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                    ),
                  ),
              ],
            );
          },
        ),
      );
}
