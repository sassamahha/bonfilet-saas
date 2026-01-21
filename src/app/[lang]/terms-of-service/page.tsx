export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-2xl font-bold text-slate-900">利用規約</h1>
        <p className="mt-2 text-sm text-slate-500">最終更新日: 2026年1月20日</p>

        <p className="mt-6 text-sm leading-7 text-slate-700">
          Bonfiletへようこそ。本利用規約（「規約」）は、Bonfiletウェブサイト（bonfilet.jp）のご利用および当プラットフォームを通じたご購入を規律します。ご注文を確定することで、お客様は本規約に同意したものとみなされます。
        </p>

        <section className="mt-8 space-y-3 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">1. 当社について</h2>
          <p>Bonfiletは、日本に登録された会社である株式会社英伝堂（Eidendo, Inc.）によって運営されています。</p>
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

        <section className="mt-8 space-y-3 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">2. 商品</h2>
          <p>
            Bonfiletは、パーソナライズされたテキストと色のカスタムファブリックブレスレットを提供しています。すべての商品は、お客様の仕様に基づいて受注生産されます。
          </p>
          <h3 className="font-semibold text-slate-900">2.1 カスタマイズ</h3>
          <p>お客様のカスタムテキストとデザインが以下を満たすことをお客様の責任とします：</p>
          <ul className="list-disc pl-5">
            <li>第三者の知的財産権を侵害しないこと</li>
            <li>攻撃的、中傷的、または違法な内容を含まないこと</li>
            <li>正しく、意図通りにスペルされていること</li>
          </ul>
          <p>当社は、不適切な内容を含む注文を拒否する権利を留保します。</p>

          <h3 className="font-semibold text-slate-900">2.2 商品仕様</h3>
          <ul className="list-disc pl-5">
            <li>最大テキスト長：40文字</li>
            <li>色：背景とテキストのカスタムHEXカラー選択</li>
            <li>ワンサイズデザインで調整可能なフィット</li>
          </ul>
        </section>

        <section className="mt-8 space-y-3 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">3. 注文と決済</h2>
          <h3 className="font-semibold text-slate-900">3.1 注文確認</h3>
          <p>
            注文は、決済処理が成功した後にのみ確定されます。メールで注文確認を受け取ります。
          </p>

          <h3 className="font-semibold text-slate-900">3.2 価格</h3>
          <p>
            すべての価格はUSDで表示され、商品代金を含みます。送料は配送先に基づいて別途計算されます。
          </p>

          <h3 className="font-semibold text-slate-900">3.3 決済</h3>
          <p>
            当社は、Stripeを通じて主要なクレジットカードを受け付けます。お客様の決済情報は安全に処理され、当社はカード情報を保存しません。
          </p>
        </section>

        <section className="mt-8 space-y-3 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">4. 配送</h2>
          <h3 className="font-semibold text-slate-900">4.1 製造と配送</h3>
          <ul className="list-disc pl-5">
            <li>商品は中国で製造されます</li>
            <li>配送はFedExによって処理されます</li>
            <li>推定配送日：7〜14営業日（配送先により異なります）</li>
          </ul>

          <h3 className="font-semibold text-slate-900">4.2 配送先</h3>
          <p>
            現在、以下の国・地域に配送しています：アメリカ合衆国、カナダ、イギリス、オーストラリア、ニュージーランド、シンガポール、香港、台湾、マレーシア、タイ、ベトナム、日本。
          </p>

          <h3 className="font-semibold text-slate-900">4.3 関税、税金</h3>
          <p>
            <span className="font-semibold">重要</span>：表示価格には送料が含まれますが、以下は含まれません：
          </p>
          <ul className="list-disc pl-5">
            <li>輸入関税</li>
            <li>税金（VAT、GSTなど）</li>
            <li>通関・ブローカー手数料</li>
          </ul>
          <p>
            これらの費用は、お客様の国の税関当局によって決定され、受取人の責任となります。FedExは、配送前、配送中、または配送後にこれらの費用を請求する場合があります。
          </p>
          <p>
            ご注文を確定することで、お客様は関税、税金、ブローカー手数料の責任を承認し、受け入れたものとみなされます。
          </p>
        </section>

        <section className="mt-8 space-y-3 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">5. 返金・返品ポリシー</h2>
          <h3 className="font-semibold text-slate-900">5.1 カスタム商品 - 返品不可</h3>
          <p>
            すべてのBonfilet商品はお客様の仕様に合わせてカスタムメイドされているため、<span className="font-semibold">当社は、お客様の都合による返品や返金を受け付けることができません</span>。
          </p>
          <p>ご注文を確定する前に、デザインを慎重にご確認ください。</p>

          <h3 className="font-semibold text-slate-900">5.2 不良品</h3>
          <p>不良品を受け取った場合：</p>
          <ol className="list-decimal pl-5">
            <li>配送後7日以内にbonfilet@eidendo.co.jpまでご連絡ください</li>
            <li>不良箇所を明確に示す写真を提供してください</li>
            <li>当社が問題を評価し、解決策を提供します</li>
          </ol>
          <p>
            注：当社は、大量注文に予備ユニットを含めており、軽微な不良に対応できるようにしています。ご連絡の前に、予備ユニットをご確認ください。
          </p>

          <h3 className="font-semibold text-slate-900">5.3 未配送</h3>
          <p>
            推定配送日から30日以内にご注文が到着しない場合は、ご連絡ください。当社はFedExと調査し、再配送または返金を行います。
          </p>
        </section>

        <section className="mt-8 space-y-3 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">6. 知的財産権</h2>
          <h3 className="font-semibold text-slate-900">6.1 お客様のコンテンツ</h3>
          <p>
            お客様が提出したテキストやデザインの所有権はお客様に帰属します。ご注文を確定することで、お客様は、商品の製造のみを目的として、当社にコンテンツを使用するライセンスを付与したものとみなされます。
          </p>

          <h3 className="font-semibold text-slate-900">6.2 当社のコンテンツ</h3>
          <p>
            Bonfiletの名称、ロゴ、ウェブサイトデザイン、およびすべての関連資料は、株式会社英伝堂が所有し、知的財産法によって保護されています。
          </p>
        </section>

        <section className="mt-8 space-y-3 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">7. 責任の制限</h2>
          <p>法律で許可される最大限の範囲で：</p>
          <ul className="list-disc pl-5">
            <li>
              当社の商品またはサービスに関連する請求に対する当社の総責任は、関連する注文に対してお客様が支払った金額を超えることはありません
            </li>
            <li>当社は、間接的、偶発的、または結果的損害について責任を負いません</li>
            <li>
              当社は、当社の制御を超える状況（配送遅延、税関保留、自然災害を含む）によって引き起こされた遅延または失敗について責任を負いません
            </li>
          </ul>
        </section>

        <section className="mt-8 space-y-3 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">8. 準拠法</h2>
          <p>
            本規約は、日本の法律に準拠します。すべての紛争は、日本の東京の裁判所で解決されます。
          </p>
        </section>

        <section className="mt-8 space-y-3 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">9. 規約の変更</h2>
          <p>
            当社は、本規約を随時更新する場合があります。変更後のサービスの継続的な使用は、新しい規約の受諾を構成します。
          </p>
        </section>

        <section className="mt-8 space-y-3 text-sm leading-7 text-slate-700">
          <h2 className="text-lg font-semibold text-slate-900">10. お問い合わせ</h2>
          <p>本規約に関するご質問がございましたら、以下までご連絡ください：</p>
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

