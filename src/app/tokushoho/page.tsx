export default function TokushohoPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-2xl font-bold text-slate-900">特定商取引法に基づく表記</h1>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-sm text-slate-700">
            <tbody>
              <tr className="border-b border-slate-200 align-top">
                <th className="w-40 bg-slate-50 px-4 py-2 text-left font-semibold">販売業者</th>
                <td className="px-4 py-2">株式会社英伝堂（Eidendo, Inc.）</td>
              </tr>
              <tr className="border-b border-slate-200 align-top">
                <th className="bg-slate-50 px-4 py-2 text-left font-semibold">代表者</th>
                <td className="px-4 py-2">佐々木 淳（Jun Sasaki）</td>
              </tr>
              <tr className="border-b border-slate-200 align-top">
                <th className="bg-slate-50 px-4 py-2 text-left font-semibold">所在地</th>
                <td className="px-4 py-2">〒107-0062 東京都港区南青山2-2-15 Win Aoyama 14F</td>
              </tr>
              <tr className="border-b border-slate-200 align-top">
                <th className="bg-slate-50 px-4 py-2 text-left font-semibold">電話番号</th>
                <td className="px-4 py-2">03-6822-4668</td>
              </tr>
              <tr className="border-b border-slate-200 align-top">
                <th className="bg-slate-50 px-4 py-2 text-left font-semibold">メールアドレス</th>
                <td className="px-4 py-2">
                  <a href="mailto:bonfilet@eidendo.co.jp" className="text-slate-900 underline">
                    bonfilet@eidendo.co.jp
                  </a>
                </td>
              </tr>
              <tr className="border-b border-slate-200 align-top">
                <th className="bg-slate-50 px-4 py-2 text-left font-semibold">URL</th>
                <td className="px-4 py-2">
                  <a href="https://bonfilet.jp" className="text-slate-900 underline">
                    https://bonfilet.jp
                  </a>
                </td>
              </tr>
              <tr className="border-b border-slate-200 align-top">
                <th className="bg-slate-50 px-4 py-2 text-left font-semibold">商品代金以外の必要料金</th>
                <td className="px-4 py-2">
                  送料（商品ページに表示）、関税・輸入消費税（お届け先国の規定による、お客様負担）
                </td>
              </tr>
              <tr className="border-b border-slate-200 align-top">
                <th className="bg-slate-50 px-4 py-2 text-left font-semibold">支払方法</th>
                <td className="px-4 py-2">クレジットカード（Stripe経由）</td>
              </tr>
              <tr className="border-b border-slate-200 align-top">
                <th className="bg-slate-50 px-4 py-2 text-left font-semibold">支払時期</th>
                <td className="px-4 py-2">注文確定時</td>
              </tr>
              <tr className="border-b border-slate-200 align-top">
                <th className="bg-slate-50 px-4 py-2 text-left font-semibold">商品の引渡時期</th>
                <td className="px-4 py-2">
                  注文確定後、通常14~21営業日（製造・国際配送の状況により変動する場合があります）
                  <br />
                  ※納期指定はご対応していません。
                </td>
              </tr>
              <tr className="border-b border-slate-200 align-top">
                <th className="bg-slate-50 px-4 py-2 text-left font-semibold">返品・交換</th>
                <td className="px-4 py-2">
                  商品の性質上（受注生産品）、お客様都合による返品・交換はお受けできません。不良品の場合は、商品到着後7日以内にメールにてご連絡ください。写真確認の上、対応いたします。
                </td>
              </tr>
              <tr className="border-b border-slate-200 align-top">
                <th className="bg-slate-50 px-4 py-2 text-left font-semibold">返品送料</th>
                <td className="px-4 py-2">不良品の場合は当社負担</td>
              </tr>
            </tbody>
          </table>
        </div>

        <section className="mt-8 space-y-2 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">製造・配送について</h2>
          <ul className="list-disc pl-5">
            <li>製造国：中国</li>
            <li>配送業者：FedEx</li>
            <li>発送元：中国工場より直送</li>
          </ul>
        </section>

        <section className="mt-6 space-y-2 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">関税について</h2>
          <p>
            海外からの発送となるため、お届け先国の関税・輸入消費税が発生する場合があります。これらの費用はお客様のご負担となります。FedExより配達時または配達後に請求される場合があります。
          </p>
        </section>

        <section className="mt-6 space-y-2 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">お問い合わせ</h2>
          <p>ご不明な点がございましたら、下記までお問い合わせください。</p>
          <p>
            <span className="font-semibold">株式会社英伝堂</span>
            <br />
            Email:{" "}
            <a href="mailto:bonfilet@eidendo.co.jp" className="text-slate-900 underline">
              bonfilet@eidendo.co.jp
            </a>
            <br />
            Tel: 03-6822-4668
            <br />
            営業時間: 平日 10:00〜18:00（土日祝休）
          </p>
        </section>
      </div>
    </main>
  );
}


