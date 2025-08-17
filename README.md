# 挨拶アドオン (Greeting Addon)

Minecraft Bedrock Edition 向けのアドオンです。  
プレイヤーがワールドに入った際に、OPを持っているプレイヤーが勝手に挨拶メッセージを送信して歓迎します。

## 特徴

-   プレイヤーがワールドに入った時に、OP持ちプレイヤーから自動で挨拶メッセージが送信されます。
-   挨拶メッセージの確率やフォーマットをコマンドでカスタマイズできます。
-   WebSocket 対応モードあり
-   有効/無効の切り替えやヘルプコマンドも用意

## コマンド一覧

| コマンド                        | 説明                                                                    |
| ------------------------------- | ----------------------------------------------------------------------- |
| `/greet:on`                     | 挨拶アドオンを有効にします                                              |
| `/greet:off`                    | 挨拶アドオンを無効にします                                              |
| `/greet:setchance <0-1>`        | 挨拶メッセージの表示確率を設定します（0〜1）                            |
| `/greet:format <format>`        | 挨拶メッセージのフォーマットを設定します（`{name}`と`{message}`が必要） |
| `/greet:websocket <true/false>` | WebSocket 対応の有効/無効を切り替えます                                 |
| `/greet:help`                   | コマンド一覧とヘルプを表示します                                        |

## インストール方法

1. [Releases](https://github.com/Nano191225/Greeting-Addon/releases)にアクセスします。
2. 最新の`Greeting-Addon.mcpack`ファイルをダウンロードします。
3. ダウンロードした mcpack ファイルをダブルクリックして Minecraft にインストールします。

## カスタマイズ

### 挨拶メッセージの表示確率を変更する

```
/greet:setchance 0.5
```

0〜1 の値で確率を指定できます（例: 0.5 で 50%の確率）。

### 挨拶メッセージのフォーマットを変更する

```
/greet:format "{name} さんが「{message}」と挨拶しました！"
```

`{name}`が挨拶する人の名前、`{message}`が挨拶文に置き換わります。

## ライセンス

GPL-3.0

---

GitHub: https://github.com/Nano191225/Greeting-Addon  
Discord: https://discord.gg/QF3n85dr4P
