export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-2xl font-bold text-slate-900">プライバシーポリシー</h1>
        <p className="mt-2 text-sm text-slate-500">最終更新日: 2026年1月20日</p>

        <p className="mt-6 text-sm leading-7 text-slate-700">
          株式会社英伝堂（Eidendo, Inc.）（「当社」「私たち」）は、Bonfiletウェブサイト（bonfilet.jp）を運営しています。本プライバシーポリシーは、当社がお客様の個人情報をどのように収集、使用、保護するかを説明します。
        </p>

        <section className="mt-8 space-y-4 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">1. 収集する情報</h2>
          <p>ご注文時に、以下の情報を収集します：</p>
          <ul className="list-disc pl-5">
            <li>
              <span className="font-semibold">連絡先情報</span>：氏名、メールアドレス、電話番号
            </li>
            <li>
              <span className="font-semibold">配送情報</span>：配送先住所
            </li>
            <li>
              <span className="font-semibold">決済情報</span>：Stripeを通じて安全に処理されます（当社はカード情報を保存しません）
            </li>
            <li>
              <span className="font-semibold">注文詳細</span>：商品のカスタマイズ選択（テキスト、色、デザイン仕様）
            </li>
          </ul>
        </section>

        <section className="mt-8 space-y-4 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">2. 情報の使用目的</h2>
          <p>お客様の情報は以下の目的で使用します：</p>
          <ul className="list-disc pl-5">
            <li>ご注文の処理と履行</li>
            <li>注文状況についてのお客様への連絡</li>
            <li>お問い合わせへの対応</li>
            <li>製品・サービスの改善</li>
            <li>法的義務の遵守</li>
          </ul>
        </section>

        <section className="mt-8 space-y-4 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">3. 情報の共有</h2>
          <p>お客様の情報は以下の場合に共有します：</p>
          <ul className="list-disc pl-5">
            <li>
              <span className="font-semibold">製造パートナー</span>：お客様の氏名、配送先住所、電話番号は、ご注文を履行しFedEx配送を可能にするため、中国の製造施設と共有されます。これは国際通関と配送に必要です。
            </li>
            <li>
              <span className="font-semibold">配送業者</span>：FedExがご注文を配送するため、配送情報を受け取ります。
            </li>
            <li>
              <span className="font-semibold">決済処理業者</span>：Stripeがお客様の決済を安全に処理します。
            </li>
          </ul>
          <p>当社は第三者に個人情報を販売することはありません。</p>
        </section>

        <section className="mt-8 space-y-4 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">4. 国際的なデータ転送</h2>
          <p>
            お客様の個人情報は、お客様の居住国以外の国（製造のための中国、決済処理のための米国を含む）に転送され、処理される場合があります。ご注文を確定することで、お客様はこの転送に同意したものとみなされます。
          </p>
        </section>

        <section className="mt-8 space-y-4 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">5. データの保持</h2>
          <p>
            当社は、カスタマーサービス目的のため、ご購入後1年間お客様の注文情報を保持します。この期間後、法律で保持が要求されない限り、お客様のデータは削除されます。
          </p>
        </section>

        <section className="mt-8 space-y-4 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">6. クッキー</h2>
          <p>当社は、以下の目的でクッキーおよび類似の技術を使用する場合があります：</p>
          <ul className="list-disc pl-5">
            <li>お客様の設定を記憶する</li>
            <li>ウェブサイトのトラフィックを分析する</li>
            <li>ユーザー体験を向上させる</li>
          </ul>
          <p>お客様はブラウザの設定を通じてクッキーを制御できます。</p>
        </section>

        <section className="mt-8 space-y-4 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">7. お客様の権利</h2>
          <p>お客様には以下の権利があります：</p>
          <ul className="list-disc pl-5">
            <li>個人情報へのアクセス</li>
            <li>不正確なデータの訂正を請求する</li>
            <li>データの削除を請求する</li>
            <li>データ処理への同意を取り消す</li>
          </ul>
          <p>
            これらの権利を行使するには、bonfilet@eidendo.co.jp までご連絡ください。
          </p>
        </section>

        <section className="mt-8 space-y-4 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">8. セキュリティ</h2>
          <p>
            当社は、お客様の個人情報を不正アクセス、改ざん、破壊から保護するため、適切な技術的および組織的措置を実施しています。
          </p>
        </section>

        <section className="mt-8 space-y-4 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">9. 児童のプライバシー</h2>
          <p>
            当社のサービスは16歳未満の個人を対象としていません。当社は、意図的に児童から個人情報を収集することはありません。
          </p>
        </section>

        <section className="mt-8 space-y-4 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">10. 本ポリシーの変更</h2>
          <p>
            当社は、本プライバシーポリシーを随時更新する場合があります。重要な変更については、ウェブサイトに新しいポリシーを掲載してお知らせします。
          </p>
        </section>

        <section className="mt-8 space-y-4 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">11. お問い合わせ</h2>
          <p>本プライバシーポリシーに関するご質問がございましたら、以下までご連絡ください：</p>
          <p>
            <span className="font-semibold">株式会社英伝堂</span>
            <br />
            〒107-0062 東京都港区南青山2-2-15 Win Aoyama 14F
            <br />
            Email:{" "}
            <a href="mailto:bonfilet@eidendo.co.jp" className="text-slate-900 underline">
              bonfilet@eidendo.co.jp
            </a>
            <br />
            Phone: +81-3-6822-4668
          </p>
        </section>
      </div>
    </main>
  );
}

