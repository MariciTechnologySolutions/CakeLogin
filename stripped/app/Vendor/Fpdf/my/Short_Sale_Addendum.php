<?php
require('fpdf.php');
	//  Define variable
	$info=array();
	$info['seller_name']='';
	$info['buyer_name']='';
	$info['premises_address']='';
	$info['date']='';
	$info['close_days']='';
	$info['seller']='';
	$info['term_and_condition']='';
	$info['buyers_signiture']='';
	$info['buyers_signiture_date']='';
	$info['brokerage_file']='';
	$info['managers_initials']='';
	$info['brokers_initials']='';
	$info['brokers_date']='';
	
class PDF extends FPDF
{
var $B;
var $I;
var $U;
var $HREF;

function PDF($orientation='P', $unit='mm', $size='A4')
{
    // Call parent constructor
    $this->FPDF($orientation,$unit,$size);
    // Initialization
    $this->B = 0;
    $this->I = 0;
    $this->U = 0;
    $this->HREF = '';
}

function WriteHTML($html)
{
    // HTML parser
    $html = str_replace("\n",' ',$html);
    $a = preg_split('/<(.*)>/U',$html,-1,PREG_SPLIT_DELIM_CAPTURE);
    foreach($a as $i=>$e)
    {
        if($i%2==0)
        {
            // Text
            if($this->HREF)
                $this->PutLink($this->HREF,$e);
            else
                $this->Write(5,$e);
        }
        else
        {
            // Tag
            if($e[0]=='/')
                $this->CloseTag(strtoupper(substr($e,1)));
            else
            {
                // Extract attributes
                $a2 = explode(' ',$e);
                $tag = strtoupper(array_shift($a2));
                $attr = array();
                foreach($a2 as $v)
                {
                    if(preg_match('/([^=]*)=["\']?([^"\']*)/',$v,$a3))
                        $attr[strtoupper($a3[1])] = $a3[2];
                }
                $this->OpenTag($tag,$attr);
            }
        }
    }
}

function OpenTag($tag, $attr)
{
    // Opening tag
    if($tag=='B' || $tag=='I' || $tag=='U')
        $this->SetStyle($tag,true);
    if($tag=='A')
        $this->HREF = $attr['HREF'];
    if($tag=='BR')
        $this->Ln(5);
}

function CloseTag($tag)
{
    // Closing tag
    if($tag=='B' || $tag=='I' || $tag=='U')
        $this->SetStyle($tag,false);
    if($tag=='A')
        $this->HREF = '';
}

function SetStyle($tag, $enable)
{
    // Modify style and select corresponding font
    $this->$tag += ($enable ? 1 : -1);
    $style = '';
    foreach(array('B', 'I', 'U') as $s)
    {
        if($this->$s>0)
            $style .= $s;
    }
    $this->SetFont('',$style);
}

function PutLink($URL, $txt)
{
    // Put a hyperlink
    $this->SetTextColor(0,0,255);
    $this->SetStyle('U',true);
    $this->Write(5,$txt,$URL);
    $this->SetStyle('U',false);
    $this->SetTextColor(0);
}


//Cell with horizontal scaling if text is too wide
	function CellFit($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link='', $scale=false, $force=true)
	{
		//Get string width
		$str_width=$this->GetStringWidth($txt);

		//Calculate ratio to fit cell
		if($w==0)
			$w = $this->w-$this->rMargin-$this->x;
		$ratio = ($w-$this->cMargin*2)/$str_width;

		$fit = ($ratio < 1 || ($ratio > 1 && $force));
		if ($fit)
		{
			if ($scale)
			{
				//Calculate horizontal scaling
				$horiz_scale=$ratio*100.0;
				//Set horizontal scaling
				$this->_out(sprintf('BT %.2F Tz ET',$horiz_scale));
			}
			else
			{
				//Calculate character spacing in points
				$char_space=($w-$this->cMargin*2-$str_width)/max($this->MBGetStringLength($txt)-1,1)*$this->k;
				//Set character spacing
				$this->_out(sprintf('BT %.2F Tc ET',$char_space));
			}
			//Override user alignment (since text will fill up cell)
			$align='';
		}

		//Pass on to Cell method
		$this->Cell($w,$h,$txt,$border,$ln,$align,$fill,$link);

		//Reset character spacing/horizontal scaling
		if ($fit)
			$this->_out('BT '.($scale ? '100 Tz' : '0 Tc').' ET');
	}

	//Cell with horizontal scaling only if necessary
	function CellFitScale($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link='')
	{
		$this->CellFit($w,$h,$txt,$border,$ln,$align,$fill,$link,true,false);
	}

	//Cell with horizontal scaling always
	function CellFitScaleForce($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link='')
	{
		$this->CellFit($w,$h,$txt,$border,$ln,$align,$fill,$link,true,true);
	}

	//Cell with character spacing only if necessary
	function CellFitSpace($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link='')
	{
		$this->CellFit($w,$h,$txt,$border,$ln,$align,$fill,$link,false,false);
	}

	//Cell with character spacing always
	function CellFitSpaceForce($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link='')
	{
		//Same as calling CellFit directly
		$this->CellFit($w,$h,$txt,$border,$ln,$align,$fill,$link,false,true);
	}

	//Patch to also work with CJK double-byte text
	function MBGetStringLength($s)
	{
		if($this->CurrentFont['type']=='Type0')
		{
			$len = 0;
			$nbbytes = strlen($s);
			for ($i = 0; $i < $nbbytes; $i++)
			{
				if (ord($s[$i])<128)
					$len++;
				else
				{
					$len++;
					$i++;
				}
			}
			return $len;
		}
		else
			return strlen($s);
	}





//  Code for creating pdf

// Page header
function Header()
{
if($this->PageNo() == 1){
	$this->SetFont('Arial','B',10);
	$this->Cell(0,3,'Presidential Realty',0,1,'L');
	$this->SetFont('Arial','B',16);
	$this->Cell(100,5,'SHORT SALE ADDENDUM',0,0,'L');
	$this->Ln();
	$this->SetFont('Arial','B',12);
	$this->Cell(100,8,'TO THE RESIDENTIAL RESALE REAL ESTATE PURCHASE CONTRACT',0,0,'L');
	$this->SetFont('Arial','',10);
	$this->Cell(0,3,'Page '.$this->PageNo().' of {nb}','',1,'R');
	$this->SetX(170);
	$this->Cell(0,5,'Document updated:','L',1,'C');
	$this->SetX(170);
	$this->SetFont('Arial','B',10);
	$this->Cell(0,4,'February 2011','L',1,'C');
	
	$this->Cell(50,28,$this->Image('images/arizona_left.png',10, $this->GetY()+4,50,20),'1',0,'C');
	$this->SetFont('Arial','B',9);
	
	$this->MultiCell(110,4,"The pre-printed portion of this form has been drafted by the Arizona Association of REALTORS®. Any change in the pre-printed language of this form must be made in a prominent manner. No representations are made as to the legal validity, adequacy and/or effects of any provision, including tax consequences thereof. If you desire legal, tax or other professional advice, please consult your attorney, tax advisor or professional consultant.",'1','L');
	$this->SetY(30);
	$this->SetX(170);
	$this->Cell(30,28,$this->Image('images/arizona_right.png',172, $this->GetY()+6,25,0),'1',0,'C');
    }
}

// Page footer
function Footer()
{	

	$str1=utf8_decode("Purchase Contract . Updated: February 2011");
	$str2=utf8_decode("Produced with zipForm® by zipLogix 18070 Fifteen Mile Road, Fraser, Michigan 48026");
	$str3=utf8_decode("Copyright © 2011 Arizona Association of REALTORS®. All rights reserved.  ");

	$this->Ln(5);
	$this->SetFont('Arial','',7);
	$this->Cell(180,5,'Short Sale Addendum to the Residential Resale Real Estate ',0,1,'C');
	$this->SetFont('Arial','',6);
	$this->Cell(180,3,$str1,0,1,'C');
	
	$this->Cell(18,5,'',1,0,'C');
	$this->Cell(18,5,'',1,0,'C');
	$this->SetFont('Arial','B',7);
	$this->Cell(10,5,'<Initials','B',0,'L');
	$this->SetFont('Arial','',7);
	$this->Cell(85,5,$str3,'B',0,'C');
	$this->SetFont('Arial','B',7);
	$this->Cell(10,5,'Initials>','B',0,'R');
	$this->Cell(18,5,'',1,0,'C');
	$this->Cell(18,5,'',1,0,'C');

	$this->Ln();
	$this->SetFont('Arial','',8);
	$this->Cell(18,5,'SELLER',1,0,'C');
	$this->Cell(18,5,'SELLER',1,0,'C');
	$this->Cell(105,10,'Page '.$this->PageNo().' of {nb}',0,0,'C');
	$this->Cell(18,5,'BUYER',1,0,'C');
	$this->Cell(18,5,'BUYER',1,0,'C');
	
	$this->Ln(10);
	$this->Cell(180,2,'Presidential Realty, 4856 E Baseline Rd #106 Mesa, AZ 85206','',1,'L'); 	
	$this->Cell(40,5,'Phone: Fax:480-235-1400','',0,'');
	$this->Cell(20,5,'','',0,'');
	$this->Cell(30,5,"480-212-5464",'',0,'');
	$this->Cell(20,5,'','',0,'');  
	$this->Cell(30,5,"Steve Peterson",'',0,'');
	$this->Cell(20,5,'','',0,'');  
	$this->Cell(10,5,"delete",'',1,'');
	
	$this->SetFont('Arial','',6);
	$this->Cell(150,5,$str2,0,0,'C');
	$this->Cell(15,5,' www.zipLogix.com',0,0,'','','https://zipLogix.com');
    
	$this->Ln();
	$this->Image('images/footer_qr_code.png',$this->GetX()+180,$this->GetY()-15,15,0);
}

}
	$pdf = new PDF('P','mm',array(215,335));
	$pdf->AliasNbPages();
	$pdf->AddPage();
	$pdf->SetY(30);
	$pdf->SetX(22);
	$pdf->Ln();	

//text
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(20,6,'','',0,'');
	$pdf->Cell(8,6,'1.','',0,'');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(20,6,'Seller:','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(140,6,$info['seller_name'],'B',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(20,6,'','',0,'');
	$pdf->Cell(8,6,'2.','',0,'');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(20,6,'Buyer:','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(140,6,$info['buyer_name'],'B',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(20,6,'','',0,'');
	$pdf->Cell(8,6,'3.','',0,'');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(30,6,'Premises Address:','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(130,6,$info['premises_address'],'B',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(20,6,'','',0,'');
	$pdf->Cell(8,6,'4.','',0,'');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(20,6,'Date:','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(140,6,$info['date'],'B',1,'');
	
	$pdf->Cell(205,3,'','',1,'');
	$pdf->Line(12,$pdf->GetY(),200,$pdf->GetY());
	$pdf->Cell(205,3,'','',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'5.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"The following additional terms and conditions are hereby included as part of the Contract between Seller and Buyer for the above",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'6.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,'referenced Premises. Delivery of all notices and documentation shall be deemed delivered and received when sent as required by','',1,'');


	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'7.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"Section 8m of the Contract.",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,8,'8.','',0,'');
	$pdf->SetFont('Arial','BU',10);
	$pdf->Cell(0,8,"CONTINGENT UPON ACCEPTABLE SHORT SALE AGREEMENT",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'9.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"Buyer and Seller acknowledge that there is more debt owing against the Premises than the purchase price. Therefore, this Contract",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'10.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"is contingent upon an agreement between the Seller and Seller's creditor(s), acceptable to both, to sell the Premises for less than",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'11.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,'the loan amount(s) ("short sale"). Buyer and Seller acknowledge that it may take weeks or months to obtain creditor(s) approval of','',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'12.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"a short sale.",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'13.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"Nothing shall limit a Seller from accepting subsequent offers from subsequent buyer(s) and submitting the back-up contract(s) to",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'14.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"Seller's creditor(s) for consideration. All parties understand and agree that Seller's creditor(s) may elect to allow the Seller to sell the",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'15.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"Premises only to the holder of the Contract with terms and conditions most acceptable to creditor(s).",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,8,'16.','',0,'');
	$pdf->SetFont('Arial','BU',10);
	$pdf->Cell(0,8,"DOCUMENTATION TO CREDITOR(S)",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'17.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"Seller shall submit to creditor(s) a copy of this Contract, including this and other Addenda, and any other documentation required by the",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'18.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"creditor(s) for approval of this sale within five (5) days after Contract acceptance. Seller agrees to diligently work to obtain short sale",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'19.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"approval and will promptly provide the creditor(s) with all additional documentation required, including an appraisal, at Seller's expense, if",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'20.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"required. Seller instructs creditor(s) to provide approval status updates to Broker(s) and Buyer upon request.",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,8,'21.','',0,'');
	$pdf->SetFont('Arial','BU',10);
	$pdf->Cell(0,8,"TERMS UPON ACCEPTABLE SHORT SALE AGREEMENT",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'22.','',0,'');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(25,5,"Agreement Notice: ",'',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"Agreement Notice: If Seller and Seller's creditors enter into a short sale agreement, the Seller shall immediately deliver notice",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'23.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,'to Buyer ("Agreement Notice").','',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'24.','',0,'');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(20,5,"Time Periods: ",'',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"The date of Seller's delivery of the Short Sale Agreement Notice to Buyer shall be deemed the date of Contract",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'25.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"acceptance for purposes of all applicable Contract time periods.",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'26.','',0,'');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(38,5,"Escrow and Earnest Money:",'',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"Buyer shall promptly open Escrow and deposit Earnest Money as described in the Contract upon receipt",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'27.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"of Agreement Notice.",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'28.','',0,'');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(25,5,"Seller Warranties:",'',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"Buyer hereby waives Seller's warranties as set forth in Lines 166-168 of Section 5a of the Contract that all listed",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'29.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"items shall be in working condition at the earlier of possession or COE. However, Seller warrants and shall maintain and repair the",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'30.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"Premises so that, pursuant to lines 169-170 of the Contract, at the earlier of possession or COE, the Premises, including all heating,",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'31.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"cooling, mechanical, plumbing, and electrical systems (including swimming pool and/or spa, motors, filter systems, cleaning systems,",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'32.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"and heaters, if any), free-standing range/oven, built-in appliances and additional existing personal property included in the sale, will",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'33.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"be in substantially the same condition as on the date of Contract acceptance and all personal property not included in the sale and",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'34.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"all debris will be removed from the Premises.",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'35.','',0,'');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(25,5,"Close of Escrow:",'',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(60,5,"Close of Escrow shall occur thirty (30) days or",'',0,'');
	$pdf->Cell(40,5,$info['close_days'],'B',0,'');
	$pdf->Cell(60,5,"days after delivery of Agreement Notice.",'',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'36.','',0,'');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(33,5,"Creditor Requirements:",'',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5," Buyer and Seller agree to cooperate with Creditor(s) and sign additional Creditor disclosure(s) or execute",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'37.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"additional addendum(a) required by Creditor(s) as a condition of approval of the short sale, provided that Buyer and Seller incur no",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'38.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"additional cost or liability.",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'39.','',0,'');
	$pdf->SetFont('Arial','BU',10);
	$pdf->Cell(0,5,"BUYER CANCELLATION",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'40.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"Buyer may unilaterally cancel this Contract by notice to Seller at any time before receipt of a short sale Agreement Notice from Seller.",'',1,'');
	
	$pdf->Ln(9);
	$pdf->Image('images/next_page_ruller.png',$pdf->GetX(),$pdf->GetY(),195,0);
	
	$pdf->AddPage();
	$pdf->Ln();
	
	$pdf->Cell(15,5,'.','',0,'');
	$pdf->SetFont('Arial','B',10);
	$pdf->Cell(0,5,"Short Sale Addendum to the Residential Resale Real Estate Purchase Contract >>",'',0,'L');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,'Page '.$pdf->PageNo().' of {nb}','',1,'R');
	$pdf->Cell(200,5,'' ,'T',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,8,'41.','',0,'');
	$pdf->SetFont('Arial','B',10);
	$pdf->Cell(0,8,"LEGAL AND TAX ADVICE",'B',1,'');
	
	$pdf->Cell(0,3,"",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'42.','',0,'');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(0,5,"Seller acknowledges that Broker is not qualified to provide financial, legal, or tax advice regarding a short sale transaction.",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'43.','',0,'');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(0,5,"Therefore, the Seller is advised to obtain professional tax advice and consult independent legal counsel immediately",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'44.','',0,'');
	$pdf->SetFont('Arial','B',8);
	$pdf->Cell(0,5,"regarding the tax implications and advisability of entering into a short sale agreement.",'',1,'');
	
	$pdf->Ln(3);
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'45.','',0,'');
	$pdf->SetFont('Arial','B',10);
	$pdf->Cell(110,5,"(SELLER'S INITIALS REQUIRED)",'',0,'R');
	$pdf->Cell(10,5,"",'',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(30,5,$info['seller'],'B',0,'R');
	$pdf->Cell(10,5,"",'',0,'');
	$pdf->Cell(30,5,$info['seller'],'B',1,'R');
	
	$pdf->SetFont('Arial','',6);
	$pdf->Cell(110,5,"",'',0,'R');
	$pdf->Cell(30,10,"SELLER",'',0,'R');
	$pdf->Cell(10,10,"",'',0,'');
	$pdf->Cell(30,10,"SELLER",'',1,'R');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'46.','',0,'');
	$pdf->SetFont('Arial','BU',10);
	$pdf->Cell(0,5,"UNFULFILLED CONTINGENCY",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'47.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"In the event that Seller and Seller's creditor(s) are unable to reach a short sale agreement acceptable to both, at the sales price contained",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'48.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"herein, Seller shall promptly notify Buyer of same, and the Contract shall be deemed cancelled due to the unfulfilled short sale contin-",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'49.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"gency. If applicable, Buyer shall be entitled to a return of any Earnest Money.",'',1,'');

	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'50.','',0,'');
	$pdf->SetFont('Arial','BU',10);
	$pdf->Cell(0,5,"OTHER TERMS AND CONDITIONS",'',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'51.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"",'B',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'52.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"",'B',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'53.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"",'B',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'54.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"",'B',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'55.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"",'B',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'56.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"",'B',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'57.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"",'B',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'58.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"",'B',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'59.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"",'B',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'60.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"",'B',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'61.','',0,'');
	$pdf->Cell(0,5,"",'B',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'62.','',0,'');
	$pdf->Cell(0,5,"",'B',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'63.','',0,'');
	$pdf->Cell(0,5,"",'B',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'64.','',0,'');
	$pdf->Cell(0,5,"",'B',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'55.','',0,'');
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(0,5,"",'B',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'66.','',0,'');
	$pdf->Cell(0,5,"",'B',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'67.','',0,'');
	$pdf->Cell(0,5,"",'B',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'68.','',0,'');
	$pdf->Cell(0,5,"",'B',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'69.','',0,'');
	$pdf->Cell(0,5,"",'B',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'70.','',0,'');
	$pdf->Cell(0,5,"",'B',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'71.','',0,'');
	$pdf->Cell(0,5,"",'B',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'72.','',0,'');
	$pdf->Cell(0,5,"",'B',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'73.','',0,'');
	$pdf->Cell(0,5,"",'B',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'74.','',0,'');
	$pdf->Cell(0,5,"",'B',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'75.','',0,'');
	$pdf->Cell(0,5,"In the event that any provision contained in this Addendum conflicts in whole or in part with any terms contained in the Contract,",'',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'76.','',0,'');
	$pdf->Cell(0,5,"the provisions of this Addendum shall prevail and the conflicting terms are hereby considered deleted and expressly waived by",'',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(5,5,'77.','',0,'');
	$pdf->Cell(0,5,"both Buyer and Seller.",'',1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(7,5,'78.','',0,'');
	$pdf->Cell(40,7,$info['buyers_signiture'],'',0,'L');
	$pdf->Cell(40,7,$info['buyers_signiture_date'],'',0,'R');
	$pdf->Cell(14,7,'','',0,'');
	$pdf->Cell(40,7,$info['buyers_signiture'],'',0,'L');
	$pdf->Cell(40,7,$info['buyers_signiture_date'],'',1,'R');
	$pdf->Cell(7,1,'','',0,'');
	$pdf->Cell(80,1,'','T',0,'');
	$pdf->Cell(14,1,'','',0,'');
	$pdf->Cell(80,1,'','T',1,'');
	$pdf->Cell(7,2,'','',0,'');
	$pdf->SetFont('Arial','',6);
	$pdf->Cell(40,2,"^  BUYER'S SIGNATURE",'',0,'L');
	$pdf->Cell(40,2,"MO/DA/YR",'',0,'R');
	$pdf->Cell(14,2,'','',0,'');
	$pdf->Cell(40,2,"^  BUYER'S SIGNATURE",'',0,'L');
	$pdf->Cell(40,2,"MO/DA/YR",'',1,'R');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(7,5,'79.','',0,'');
	$pdf->Cell(40,7,$info['buyers_signiture'],'',0,'L');
	$pdf->Cell(40,7,$info['buyers_signiture_date'],'',0,'R');
	$pdf->Cell(14,7,'','',0,'');
	$pdf->Cell(40,7,$info['buyers_signiture'],'',0,'L');
	$pdf->Cell(40,7,$info['buyers_signiture_date'],'',1,'R');
	$pdf->Cell(7,1,'','',0,'');
	$pdf->Cell(80,1,'','T',0,'');
	$pdf->Cell(14,1,'','',0,'');
	$pdf->Cell(80,1,'','T',1,'');
	$pdf->Cell(7,2,'','',0,'');
	$pdf->SetFont('Arial','',6);
	$pdf->Cell(40,2,"^  BUYER'S SIGNATURE",'',0,'L');
	$pdf->Cell(40,2,"MO/DA/YR",'',0,'R');
	$pdf->Cell(14,2,'','',0,'');
	$pdf->Cell(40,2,"^  BUYER'S SIGNATURE",'',0,'L');
	$pdf->Cell(40,2,"MO/DA/YR",'',1,'R');
	
	$pdf->Ln(5);
	$pdf->Line(15,$pdf->GetY(),205,$pdf->GetY());
	$pdf->Line(15,$pdf->GetY(),15,$pdf->GetY()+14);
	$pdf->Line(205,$pdf->GetY(),205,$pdf->GetY()+14);
	
	$pdf->SetFont('Arial','B',10);	
	$pdf->Cell(5,1,'','',0,''); 	// Broker use
	$pdf->Cell(20,5,'For Broker Use Only:','',1,'');
	$pdf->SetFont('Arial','',10);
	$pdf->Cell(5,1,'','',0,'');
	$pdf->Cell(40,5,'Brokerage File/Log No.','',0,'');
	$pdf->Cell(20,5,$info['brokerage_file'],'B',0,'');
	$pdf->Cell(30,5,"Manager's Initials.",'',0,'');
	$pdf->Cell(20,5,$info['managers_initials'],'B',0,'');  
	$pdf->Cell(30,5,"Broker's Initials.",'',0,'');
	$pdf->Cell(20,5,$info['brokers_initials'],'B',0,'');  
	$pdf->Cell(10,5,"Date",'',0,'');
	$pdf->Cell(20,5,$info['brokers_date'],'B',2,''); 
	$pdf->SetFont('Arial','',8); 
	$pdf->Cell(20,5,'MO/DA/YR','T',1,'C');  
	
	$pdf->SetY($pdf->GetY()-2);
	$pdf->SetX($pdf->GetX()+5);
	$pdf->SetFont('Arial','',6);
	$pdf->Cell(7,1,'','B',0,''); 	
	$pdf->Cell(24,4,'(Added February 2012)','',0,'');  
	$pdf->Cell(159,1,'','B',1,'');  
	
	$pdf->Ln(9);
	$pdf->Cell(200,2,'','B',1,'');  

	$pdf->Output('','I');

?>