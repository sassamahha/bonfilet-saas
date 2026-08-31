import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TokushohoPage() {
  return (
    <>
      <Header locale="ja" />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
          <h1 className="h2 text-ink">特定商取引法に基づく表記</h1>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-sm text-ink-2">
              <tbody>
                <tr className="border-b border-line align-top">
                  <th className="w-40 bg-bg-muted px-4 py-2 text-left font-medium text-ink">販売業者</th>
                  <td className="px-4 py-2">株式会社英伝堂（Eidendo, Inc.）</td>
                </tr>
                <tr className="border-b border-line align-top">
                  <th className="bg-bg-muted px-4 py-2 text-left font-medium text-ink">代表者</th>
                  <td className="px-4 py-2">佐々木 淳（Jun Sasaki）</td>
                </tr>
                <tr className="border-b border-line align-top">
                  <th className="bg-bg-muted px-4 py-2 text-left font-medium text-ink">所在地</th>
                  <td className="px-4 py-2">〒107-0062 東京都港区南青山2-2-15 Win Aoyama 14F</td>
                </tr>
                <tr className="border-b border-line align-top">
                  <th className="bg-bg-muted px-4 py-2 text-left font-medium text-ink">電話番号</th>
                  <td className="px-4 py-2">ご請求があれば遅滞なく開示いたします（お問い合わせはメールにて承ります）</td>
                </tr>
                <tr className="border-b border-line align-top">
                  <th className="bg-bg-muted px-4 py-2 text-left font-medium text-ink">メールアドレス</th>
                  <td className="px-4 py-2">
                    <a href="mailto:bonfilet@eidendo.co.jp" className="text-ink underline underline-offset-4 hover:text-accent">
                      bonfilet@eidendo.co.jp
                    </a>
                  </td>
                </tr>
                <tr className="border-b border-line align-top">
                  <th className="bg-bg-muted px-4 py-2 text-left font-medium text-ink">URL</th>
                  <td className="px-4 py-2">
                    <a href="https://bonfilet.jp" className="text-ink underline underline-offset-4 hover:text-accent">
                      https://bonfilet.jp
                    </a>
                  </td>
                </tr>
                <tr className="border-b border-line align-top">
                  <th className="bg-bg-muted px-4 py-2 text-left font-medium text-ink">商品代金以外の必要料金</th>
                  <td className="px-4 py-2">
                    送料および関税・輸入消費税（いずれも注文時に表示・前払い。お届け時の追加請求はありません）
                  </td>
                </tr>
                <tr className="border-b border-line align-top">
                  <th className="bg-bg-muted px-4 py-2 text-left font-medium text-ink">支払方法</th>
                  <td className="px-4 py-2">クレジットカード（Stripe経由）</td>
                </tr>
                <tr className="border-b border-line align-top">
                  <th className="bg-bg-muted px-4 py-2 text-left font-medium text-ink">支払時期</th>
                  <td className="px-4 py-2">注文確定時</td>
                </tr>
                <tr className="border-b border-line align-top">
                  <th className="bg-bg-muted px-4 py-2 text-left font-medium text-ink">商品の引渡時期</th>
                  <td className="px-4 py-2">
                    注文確定後、通常14~21営業日（製造・国際配送の状況により変動する場合があります）
                    <br />
                    ※納期指定は、事前に
                    <a href="https://eidendo.co.jp/contact" className="text-ink underline underline-offset-4 hover:text-accent">
                      こちら
                    </a>
                    からご連絡ください。
                  </td>
                </tr>
                <tr className="border-b border-line align-top">
                  <th className="bg-bg-muted px-4 py-2 text-left font-medium text-ink">返品・交換</th>
                  <td className="px-4 py-2">
                    商品の性質上（受注生産品）、お客様都合による返品・交換はお受けできません。不良品の場合は、商品到着後7日以内にメールにてご連絡ください。写真確認の上、対応いたします。
                  </td>
                </tr>
                <tr className="border-b border-line align-top">
                  <th className="bg-bg-muted px-4 py-2 text-left font-medium text-ink">返品送料</th>
                  <td className="px-4 py-2">不良品の場合は当社負担</td>
                </tr>
              </tbody>
            </table>
          </div>

          <section className="mt-8 space-y-2 text-sm leading-7 text-ink-2">
            <h2 className="text-lg font-semibold text-ink">製造・配送について</h2>
            <ul className="list-disc pl-5">
              <li>製造国：中国</li>
              <li>配送業者：FedEx</li>
              <li>発送元：中国工場より直送</li>
            </ul>
          </section>

          <section className="mt-6 space-y-2 text-sm leading-7 text-ink-2">
            <h2 className="text-lg font-semibold text-ink">関税について</h2>
            <p>
              海外（中国）からの発送となりますが、お届け先国の関税・輸入消費税は注文時の合計金額に含まれており、当社が前払いで処理します（DDP）。お届け時に FedEx から追加で請求されることはありません。関税の取り扱いが確認できた国のみ配送対象としています。
            </p>
          </section>

          <section className="mt-6 space-y-2 text-sm leading-7 text-ink-2">
            <h2 className="text-lg font-semibold text-ink">お問い合わせ</h2>
            <p>ご不明な点がございましたら、下記までお問い合わせください。</p>
            <p>
              <span className="font-semibold">株式会社英伝堂</span>
              <br />
              Email:{" "}
              <a href="mailto:bonfilet@eidendo.co.jp" className="text-ink underline underline-offset-4 hover:text-accent">
                bonfilet@eidendo.co.jp
              </a>
              <br />
              対応はメールのみとなります（平日 10:00〜18:00、土日祝休）
            </p>
          </section>
        </div>
      </main>
      <Footer locale="ja" />
    </>
  );
}
